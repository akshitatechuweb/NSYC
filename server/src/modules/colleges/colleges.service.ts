import { Injectable, OnModuleInit, Logger, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { College, CollegeResponse, Course } from './interfaces/colleges.interface';
import { GetCollegesQueryDto, SortOrder } from './dto/get-colleges-query.dto';

@Injectable()
export class CollegesService implements OnModuleInit {
  private readonly logger = new Logger(CollegesService.name);
  private colleges: College[] = [];
  private flattenedColleges: CollegeResponse[] = [];

  onModuleInit() {
    this.loadData();
  }

  private loadData() {
    try {
      const filePath = path.join(process.cwd(), 'src', 'data', 'colleges.json');
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      this.colleges = JSON.parse(fileContent);
      
      // Pre-flatten data for easier filtering based on clean response format
      this.flattenedColleges = this.colleges.flatMap((college) =>
        college.courses.map((course) => ({
          name: college.name,
          state: college.state,
          course: course.name,
          fees: course.fees,
          mode: course.mode,
        }))
      );

      this.logger.log(`Loaded ${this.colleges.length} colleges and ${this.flattenedColleges.length} course entries.`);
    } catch (error) {
      this.logger.error('Failed to load colleges data:', error.message);
      this.colleges = [];
      this.flattenedColleges = [];
    }
  }

  findAll(query: GetCollegesQueryDto) {
    const {
      course,
      state,
      maxFees,
      mode,
      search,
      sortBy,
      sortOrder,
      page = 1,
      limit = 10,
    } = query;

    let results = [...this.flattenedColleges];

    // Case-insensitive filtering
    if (course) {
      results = results.filter((item) =>
        item.course.toLowerCase() === course.toLowerCase()
      );
    }

    if (state) {
      results = results.filter((item) =>
        item.state.toLowerCase() === state.toLowerCase()
      );
    }

    if (maxFees) {
      results = results.filter((item) => item.fees <= maxFees);
    }

    if (mode) {
      results = results.filter((item) =>
        item.mode.some((m) => m.toLowerCase() === mode.toLowerCase())
      );
    }

    // Search by college name
    if (search) {
      const searchTerms = search.toLowerCase();
      results = results.filter((item) =>
        item.name.toLowerCase().includes(searchTerms)
      );
    }

    // Sorting
    if (sortBy) {
      results.sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortOrder === SortOrder.ASC ? valA - valB : valB - valA;
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();

        if (strA < strB) return sortOrder === SortOrder.ASC ? -1 : 1;
        if (strA > strB) return sortOrder === SortOrder.ASC ? 1 : -1;
        return 0;
      });
    }

    // Handle empty results early
    if (results.length === 0) {
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }

    // Pagination
    const total = results.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = results.slice(start, end);

    return {
      data: paginatedData,
      total,
      page,
      limit,
      totalPages,
    };
  }

  findOneCourse(collegeName: string, courseName: string): CollegeResponse | undefined {
    return this.flattenedColleges.find(
      (item) =>
        item.name.toLowerCase() === collegeName.toLowerCase() &&
        item.course.toLowerCase() === courseName.toLowerCase()
    );
  }
}
