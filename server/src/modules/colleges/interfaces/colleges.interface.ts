export interface Course {
  name: string;
  fees: number;
  mode: string[];
}

export interface College {
  name: string;
  state: string;
  courses: Course[];
}

export interface CollegeResponse {
  name: string;
  state: string;
  course: string;
  fees: number;
  mode: string[];
  [key: string]: string | number | string[];
}
