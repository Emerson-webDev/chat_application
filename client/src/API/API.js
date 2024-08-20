import axios from "axios";

//this when your running the app in you localhost
const isMobile = () => {
  return /Mobi|Android|iPhone|iPad|iPod|Windows Phone|KFAPWI/i.test(navigator.userAgent);
}

// Set the base URL based on whether the user is on mobile or not
const baseURL = isMobile() ? "https://192.168.100.22:3001/" : "https://localhost:3001/";

//use this baseURL depends on what services you upload you serve api
// const baseURL = 'https://your_app.onrender.com'

export default axios.create({
  baseURL: baseURL
});

export { baseURL }