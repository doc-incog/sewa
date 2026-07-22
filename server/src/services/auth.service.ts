import { User, IUser } from "../models/User";
import { Provider } from "../models/Provider";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  TokenPayload,
} from "../utils/jwt";

interface AuthResult {
  user: Partial<IUser>;
  accessToken: string;
  refreshToken: string;
}

interface SignupInput {
  name: string;
  email?: string;
  phone: string;
  password: string;
}

interface ProviderSignupInput extends SignupInput {
  businessName: string;
  description?: string;
}

export const signup = async (data: SignupInput): Promise<AuthResult> => {
  const existingPhone = await User.findOne({ phone: data.phone });
  if (existingPhone) {
    throw new Error("Phone number already registered");
  }

  if (data.email) {
    const existingEmail = await User.findOne({ email: data.email });
    if (existingEmail) {
      throw new Error("Email already registered");
    }
  }

  const user = await User.create({
    name: data.name,
    email: data.email || "",
    password: data.password,
    phone: data.phone,
    role: "user",
  });

  const tokenPayload: TokenPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  return {
    user,
    accessToken: generateAccessToken(tokenPayload),
    refreshToken: generateRefreshToken(tokenPayload),
  };
};

export const providerSignup = async (data: ProviderSignupInput): Promise<AuthResult> => {
  const existingPhone = await User.findOne({ phone: data.phone });
  if (existingPhone) {
    throw new Error("Phone number already registered");
  }

  if (data.email) {
    const existingEmail = await User.findOne({ email: data.email });
    if (existingEmail) {
      throw new Error("Email already registered");
    }
  }

  const user = await User.create({
    name: data.name,
    email: data.email || "",
    password: data.password,
    phone: data.phone,
    role: "provider",
  });

  await Provider.create({
    userId: user._id,
    businessName: data.businessName,
    description: data.description || "",
  });

  const tokenPayload: TokenPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  return {
    user,
    accessToken: generateAccessToken(tokenPayload),
    refreshToken: generateRefreshToken(tokenPayload),
  };
};

export const login = async (identifier: string, password: string): Promise<AuthResult> => {
  const user = await User.findOne({
    $or: [{ email: identifier }, { phone: identifier }],
  }).select("+password");

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const tokenPayload: TokenPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  return {
    user,
    accessToken: generateAccessToken(tokenPayload),
    refreshToken: generateRefreshToken(tokenPayload),
  };
};

export const refreshTokens = async (refreshToken: string): Promise<AuthResult> => {
  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new Error("User not found");
  }

  const tokenPayload: TokenPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  return {
    user,
    accessToken: generateAccessToken(tokenPayload),
    refreshToken: generateRefreshToken(tokenPayload),
  };
};

export const getMe = async (userId: string): Promise<Partial<IUser>> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
