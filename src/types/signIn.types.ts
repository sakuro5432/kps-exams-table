interface User {
  loginName: string;
  userType: string;
  idCode: string;
  titleTh: string;
  titleEn: string;
  firstNameTh: string;
  firstNameEn: string;
  middleNameTh: any;
  middleNameEn: any;
  lastNameTh: string;
  lastNameEn: string;
  avatar: string;
  gender: string;
  student: Student;
  roleMenus: RoleMenu[];
}

interface Student {
  loginName: string;
  stdId: string;
  stdCode: string;
  titleTh: string;
  titleEn: string;
  firstNameTh: string;
  middleNameTh: any;
  lastNameTh: string;
  firstNameEn: string;
  middleNameEn: any;
  lastNameEn: string;
  copenId: string;
  copenNameTh: string;
  copenNameEn: string;
  campusCode: string;
  campusNameTh: string;
  campusNameEn: string;
  facultyCode: string;
  facultyNameTh: string;
  facultyNameEn: string;
  departmentCode: string;
  departmentNameTh: string;
  departmentNameEn: string;
  majorCode: string;
  majorNameTh: string;
  majorNameEn: string;
  nationCode: string;
  nationalityNameTh: string;
  nationalityNameEn: string;
  studentStatusCode: string;
  studentStatusNameTh: string;
  studentStatusNameEn: string;
  studentTypeCode: string;
  studentTypeNameTh: string;
  studentTypeNameEn: string;
  edulevelCode: string;
  edulevelNameTh: string;
  edulevelNameEn: string;
  studentYear: string;
  advisorId: string;
  advisorNameTh: string;
  advisorNameEn: string;
  positionTh: string;
  email: string;
  mobileNo: string;
}

interface RoleMenu {
  menuId: number;
  menuNameTh: string;
  menuUrl?: string;
  menuIcon?: string;
  parentMenuId: number;
  menuType: number;
}

export type LoginProfile = User;
export interface MyKuUserTokenInterface {
  username: string;
  usertype: string;
  idcode: string;
  stdid: string;
  firstNameEn: string;
  firstNameTh: string;
  lastNameEn: string;
  lastNameTh: string;
  titleTh: string;
  roleId: any;
  stdStatusCode: string;
  iat: number;
  exp: number;
}
