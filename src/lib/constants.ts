// Indian States, Union Territories, Regions, Categories, and Enums

export const INDIAN_STATES_AND_UTS = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi NCR', 'Chandigarh', 'Jammu and Kashmir', 'Ladakh', 'Puducherry'
] as const;

export const POPULAR_STUDENT_CITIES: Record<string, { state: string; nearby: string[] }> = {
  'Bengaluru': { state: 'Karnataka', nearby: ['Mysuru', 'Tumakuru', 'Hosur'] },
  'Pune': { state: 'Maharashtra', nearby: ['Mumbai', 'Nashik', 'Satara', 'Kolhapur'] },
  'Mumbai': { state: 'Maharashtra', nearby: ['Thane', 'Navi Mumbai', 'Pune'] },
  'Delhi': { state: 'Delhi NCR', nearby: ['Noida', 'Gurugram', 'Faridabad', 'Ghaziabad'] },
  'Hyderabad': { state: 'Telangana', nearby: ['Secunderabad', 'Warangal'] },
  'Chennai': { state: 'Tamil Nadu', nearby: ['Kanchipuram', 'Vellore'] },
  'Kolkata': { state: 'West Bengal', nearby: ['Howrah', 'Kalyani'] },
  'Nagpur': { state: 'Maharashtra', nearby: ['Wardha', 'Amravati', 'Chandrapur', 'Bhandara'] },
  'Ahmedabad': { state: 'Gujarat', nearby: ['Gandhinagar', 'Vadodara'] },
  'Jaipur': { state: 'Rajasthan', nearby: ['Ajmer', 'Kota'] },
  'Indore': { state: 'Madhya Pradesh', nearby: ['Bhopal', 'Ujjain'] },
  'Lucknow': { state: 'Uttar Pradesh', nearby: ['Kanpur', 'Ayodhya'] },
  'Chandigarh': { state: 'Chandigarh', nearby: ['Mohali', 'Panchkula', 'Ambala'] },
  'Kochi': { state: 'Kerala', nearby: ['Thrissur', 'Kottayam', 'Thiruvananthapuram'] },
  'Coimbatore': { state: 'Tamil Nadu', nearby: ['Tiruppur', 'Salem', 'Erode'] },
  'Bhubaneswar': { state: 'Odisha', nearby: ['Cuttack', 'Puri'] },
  'Patna': { state: 'Bihar', nearby: ['Gaya', 'Muzaffarpur'] }
};

export const ACADEMIC_STREAMS = [
  'Engineering',
  'Science',
  'Commerce',
  'Arts',
  'Medical',
  'Pharmacy',
  'Management',
  'Polytechnic',
  'Agriculture',
  'Law',
  'Other'
] as const;

export const EDUCATION_LEVELS = [
  { value: 'all', label: 'All Levels' },
  { value: 'high_school', label: '11th / 12th Grade' },
  { value: 'diploma_polytechnic', label: 'Diploma / Polytechnic' },
  { value: 'undergraduate', label: 'Undergraduate (B.Tech, B.Sc, B.Com, MBBS, etc.)' },
  { value: 'postgraduate', label: 'Postgraduate (M.Tech, M.Sc, MBA, etc.)' },
  { value: 'phd', label: 'PhD / Doctoral Scholar' }
] as const;

export const CATEGORY_LABELS = {
  hackathon: 'Hackathons',
  scholarship: 'Scholarships',
  internship: 'Internships',
  competition: 'Competitions',
  workshop: 'Workshops & Events'
} as const;

export const DEFAULT_DEMO_BANNER = {
  enabled: true,
  message: "Demo Mode Active: Genuine source-verified opportunities are mixed with tagged demo records for evaluation. Supabase and Gemini integrations are configured for one-click setup."
};
