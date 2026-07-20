export const FIREBASE_API_KEY_CPM1 = 'AIzaSyBW1ZbMiUeDZHYUO2bY8Bfnf5rRgrQGPTM';
export const RANK_URL_CPM1 = 'https://us-central1-cp-multiplayer.cloudfunctions.net/SetUserRating4';

export const getHeaders = () => ({
  "Content-Type": "application/json",
  "X-Firebase-Client": "fire-android/9.0.0",
  "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 13; SM-S918B)"
});

export const authenticateFirebase = async (email: string, password: string) => {
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY_CPM1}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ email, password, returnSecureToken: true })
  });
  const data = await res.json();
  if (data.idToken) return data;
  throw new Error(data.error?.message || "Failed to authenticate with Firebase");
};

export const setKingRank = async (email: string, password: string) => {
  const auth = await authenticateFirebase(email, password);
  
  const ratingData = {
    "cars": 100000, "car_fix": 100000, "car_collided": 100000, "car_exchange": 100000, "car_trade": 100000, 
    "car_wash": 100000, "slicer_cut": 100000, "drift_max": 100000, "drift": 100000, "cargo": 100000, 
    "delivery": 100000, "taxi": 100000, "levels": 100000, "gifts": 100000, "fuel": 100000, 
    "offroad": 100000, "speed_banner": 100000, "reactions": 100000, "police": 100000, "run": 100000, 
    "real_estate": 100000, "t_distance": 100000, "treasure": 100000, "block_post": 100000, 
    "push_ups": 100000, "burnt_tire": 100000, "passanger_distance": 100000, "time": 10000000000, 
    "race_win": 3000
  };

  const payload = JSON.stringify({
    "data": JSON.stringify({ RatingData: ratingData })
  });

  const res = await fetch(RANK_URL_CPM1, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${auth.idToken}`,
      "Content-Type": "application/json",
      "User-Agent": "okhttp/3.12.13" 
    },
    body: payload
  });
  
  if (res.ok) return true;
  const errorText = await res.text();
  throw new Error(errorText);
};

export const changeEmailFirebase = async (email: string, password: string, newEmail: string) => {
  const auth = await authenticateFirebase(email, password);
  
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${FIREBASE_API_KEY_CPM1}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      idToken: auth.idToken,
      email: newEmail,
      returnSecureToken: true
    })
  });
  
  const data = await res.json();
  if (data.email) return data;
  throw new Error(data.error?.message || "Failed to change email");
};

export const changePasswordFirebase = async (email: string, password: string, newPassword: string) => {
  const auth = await authenticateFirebase(email, password);
  
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${FIREBASE_API_KEY_CPM1}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      idToken: auth.idToken,
      password: newPassword,
      returnSecureToken: true
    })
  });
  
  const data = await res.json();
  if (data.email) return data;
  throw new Error(data.error?.message || "Failed to change password");
};

export const getAccountInfoFirebase = async (email: string, password: string) => {
  const auth = await authenticateFirebase(email, password);
  
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY_CPM1}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ idToken: auth.idToken })
  });
  
  const data = await res.json();
  if (data.users && data.users.length > 0) return data.users[0];
  throw new Error(data.error?.message || "Failed to fetch account info");
};

export const sendPasswordResetFirebase = async (email: string) => {
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${FIREBASE_API_KEY_CPM1}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ requestType: "PASSWORD_RESET", email })
  });
  
  const data = await res.json();
  if (data.email) return data;
  throw new Error(data.error?.message || "Failed to send reset link");
};

