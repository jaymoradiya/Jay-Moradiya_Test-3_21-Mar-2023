/// in future we can make this interface common/general for all  using generic type and dynamic property names
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  programs: T;
}
