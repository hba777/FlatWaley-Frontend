import api from "@/utils/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  listing_id?: string;
  profile_id?: string;
}

export interface GoogleAuthRequest {
  id_token: string;
}

export interface UserResponse {
  id: string;
  username: string;
  email?: string;
  token?: string;
  listing_id?: string;
  profile_id?: string;
  is_verified?: boolean;
}

export interface UserProfileData {
  id: string;
  raw_profile_text: string;
  city: string;
  area: string;
  budget_PKR: number;
  sleep_schedule?: string;
  cleanliness?: string;
  noise_tolerance?: string;
  study_habits?: string;
  food_pref?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

class UserApiService {
  async login(credentials: LoginRequest): Promise<UserResponse> {
    try {
      const response = await api.post<AuthResponse>(
        "/users/login",
        credentials
      );

      // After successful login, get user details
      const userDetails = await this.getUserProfile(response.data.access_token);

      return {
        ...userDetails,
        token: response.data.access_token,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || error.message || "Login failed";
      throw new Error(errorMessage);
    }
  }

  async register(userData: RegisterRequest): Promise<UserResponse> {
    try {
      const response = await api.post<UserResponse>(
        "/users/register",
        userData
      );
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || error.message || "Registration failed";
      throw new Error(errorMessage);
    }
  }

  async googleAuth(googleData: GoogleAuthRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(
        "/users/google",
        googleData
      );
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Google authentication failed";
      throw new Error(errorMessage);
    }
  }

  async getUserProfile(token?: string): Promise<UserResponse> {
    try {
      // If token is provided, set it as a cookie first
      if (token) {
        document.cookie = `access_token=${token}; path=/; samesite=lax`;
      }

      const response = await api.get<UserResponse>("/users/me");
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to get user profile";
      throw new Error(errorMessage);
    }
  }

  async verifyToken(token: string): Promise<UserResponse> {
    try {
      const response = await api.post<UserResponse>("/users/verify-token", {
        token,
      });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Token verification failed";
      throw new Error(errorMessage);
    }
  }

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>(
        "/users/resend-verification",
        { email }
      );
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to resend verification email";
      throw new Error(errorMessage);
    }
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>(
        "/users/verify-email",
        { token }
      );
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Email verification failed";
      throw new Error(errorMessage);
    }
  }

  async verifyEmailWithToken(
    token: string,
    email: string
  ): Promise<{ message: string; access_token?: string }> {
    try {
      const response = await api.get<{
        status: string;
        message: string;
        access_token?: string;
      }>(`/users/verify?token=${token}&email=${email}`);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Email verification failed";
      throw new Error(errorMessage);
    }
  }

  async logout(): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>("/users/logout");
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || error.message || "Logout failed";
      throw new Error(errorMessage);
    }
  }

  async getUserProfileData(profileId: string): Promise<UserProfileData> {
    try {
      const response = await api.get<UserProfileData>(`/profiles/${profileId}`);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to get user profile data";
      throw new Error(errorMessage);
    }
  }

  async likeProfile(
    profileId: string,
    token?: string
  ): Promise<{ message: string }> {
    try {
      // If token is provided, set it as cookie for API auth
      if (token) {
        document.cookie = `access_token=${token}; path=/; samesite=lax`;
      }

      const response = await api.post<{ message: string }>(
        `/users/like-profile/${profileId}`
      );
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to like profile";
      throw new Error(errorMessage);
    }
  }

  async getLikedProfiles(): Promise<UserProfileData[]> {
    try {
      const response = await api.get<UserProfileData[]>(
        "/users/liked-profiles"
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail ||
          error.message ||
          "Failed to fetch liked profiles"
      );
    }
  }

  async unlikeProfile(profileId: string): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>(
        `/users/unlike-profile/${profileId}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail ||
          error.message ||
          "Failed to unlike profile"
      );
    }
  }
}

export const userApi = new UserApiService();
