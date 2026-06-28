/**
 * Validators utility for form validation based on API types
 */

export interface ValidationErrors {
  [key: string]: string;
}

// Email validation
export const validateEmail = (email: string): string | null => {
  if (!email) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email format";
  return null;
};

// Password validation
export const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
};

// Confirm password validation
export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) return "Confirm password is required";
  if (password !== confirmPassword) return "Passwords do not match";
  return null;
};

// Name validation
export const validateName = (name: string): string | null => {
  if (!name) return "Name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  return null;
};

// Username validation
export const validateUsername = (username: string): string | null => {
  if (!username) return "Username is required";
  if (username.trim().length < 3) return "Username must be at least 3 characters";
  if (!/^[a-zA-Z0-9_-_@]+$/.test(username)) return "Username can only contain letters, numbers, hyphens, and underscores";
  return null;
};

// Bio validation
export const validateBio = (bio: string): string | null => {
  if (bio && bio.length > 500) return "Bio must not exceed 500 characters";
  return null;
};

// Review text validation
export const validateReviewText = (text: string): string | null => {
  if (!text) return "Review text is required";
  if (text.trim().length < 10) return "Review must be at least 10 characters";
  if (text.length > 1000) return "Review must not exceed 1000 characters";
  return null;
};

// Rating validation
export const validateRating = (rating: number): string | null => {
  if (rating === undefined || rating === null) return "Rating is required";
  if (rating < 1 || rating > 5) return "Rating must be between 1 and 5";
  return null;
};

// Overall rating validation (from review)
export const validateOverallRating = (food: number, service: number, ambience: number, price: number): string | null => {
  const foodError = validateRating(food);
  const serviceError = validateRating(service);
  const ambienceError = validateRating(ambience);
  const priceError = validateRating(price);

  if (foodError) return `Food Rating: ${foodError}`;
  if (serviceError) return `Service Rating: ${serviceError}`;
  if (ambienceError) return `Ambience Rating: ${ambienceError}`;
  if (priceError) return `Price Rating: ${priceError}`;
  
  return null;
};

// Reel title validation
export const validateReelTitle = (title: string): string | null => {
  if (!title) return "Reel title is required";
  if (title.trim().length < 3) return "Reel title must be at least 3 characters";
  if (title.length > 100) return "Reel title must not exceed 100 characters";
  return null;
};

// Reel description validation
export const validateReelDescription = (description: string): string | null => {
  if (!description) return "Reel description is required";
  if (description.trim().length < 5) return "Reel description must be at least 5 characters";
  if (description.length > 500) return "Reel description must not exceed 500 characters";
  return null;
};

// Video file validation
export const validateVideoFile = (file: File | null): string | null => {
  if (!file) return "Video file is required";
  const maxSizeInMB = 50;
  const fileSizeInMB = file.size / (1024 * 1024);
  if (fileSizeInMB > maxSizeInMB) return `Video file must not exceed ${maxSizeInMB}MB`;
  const validFormats = ["video/mp4", "video/webm"];
  if (!validFormats.includes(file.type)) return "Only MP4 and WebM video formats are supported";
  return null;
};

// Image file validation
export const validateImageFile = (file: File | null): string | null => {
  if (!file) return null; // Image is optional
  const maxSizeInMB = 10;
  const fileSizeInMB = file.size / (1024 * 1024);
  if (fileSizeInMB > maxSizeInMB) return `Image file must not exceed ${maxSizeInMB}MB`;
  const validFormats = ["image/jpeg", "image/png", "image/jpg"];
  if (!validFormats.includes(file.type)) return "Only JPG and PNG image formats are supported";
  return null;
};

// Validate login form
export const validateLoginForm = (email: string, password: string): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;
  
  return errors;
};

// Validate signup form
export const validateSignupForm = (
  name: string,
  username: string,
  email: string,
  password: string,
  confirmPassword: string
): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  const nameError = validateName(name);
  if (nameError) errors.name = nameError;
  
  const usernameError = validateUsername(username);
  if (usernameError) errors.username = usernameError;
  
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;
  
  const confirmPasswordError = validateConfirmPassword(password, confirmPassword);
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
  
  return errors;
};

// Validate review form
export const validateReviewForm = (
  text: string,
  food: number,
  service: number,
  ambience: number,
  price: number
): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  const textError = validateReviewText(text);
  if (textError) errors.text = textError;
  
  const ratingError = validateOverallRating(food, service, ambience, price);
  if (ratingError) errors.rating = ratingError;
  
  return errors;
};

// Validate reel upload form
export const validateReelUploadForm = (
  title: string,
  description: string,
  video: File | null
): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  const titleError = validateReelTitle(title);
  if (titleError) errors.title = titleError;
  
  const descriptionError = validateReelDescription(description);
  if (descriptionError) errors.description = descriptionError;
  
  const videoError = validateVideoFile(video);
  if (videoError) errors.video = videoError;
  
  return errors;
};

// Validate profile update form
export const validateProfileForm = (
  name: string,
  username: string,
  email: string,
  bio: string
): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  const nameError = validateName(name);
  if (nameError) errors.name = nameError;
  
  const usernameError = validateUsername(username);
  if (usernameError) errors.username = usernameError;
  
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;
  
  const bioError = validateBio(bio);
  if (bioError) errors.bio = bioError;
  
  return errors;
};

// Check if validation errors object is empty
export const hasErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

// Get first error message
export const getFirstError = (errors: ValidationErrors): string | null => {
  const errorMessages = Object.values(errors);
  return errorMessages.length > 0 ? errorMessages[0] : null;
};
