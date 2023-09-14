export class ApiException {
  constructor(keyword: string, message?: any) {
    this.keyword = keyword;
    this.message = message;
  }
  keyword: string;
  message: any;
}
