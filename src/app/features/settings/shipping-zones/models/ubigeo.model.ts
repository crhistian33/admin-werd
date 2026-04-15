export interface Department {
  id: string;
  name: string;
}

export interface Province {
  id: string;
  name: string;
  departmentId: string;
}

export interface District {
  id: string;
  name: string;
  provinceId: string;
}
