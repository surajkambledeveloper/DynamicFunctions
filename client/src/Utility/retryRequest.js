// 📦 Reusable Retry Utility Function
const retryRequest = async (axiosCall, maxRetries = 3, delay = 2000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(` Attempt ${attempt}...`);
      const response = await axiosCall();
      console.log(" Success on attempt:", attempt);
      return response; // Success, exit loop
    } catch (error) {
      console.error(` Attempt ${attempt} failed:`, error.message);

      if (attempt === maxRetries) {
        console.error(" All retry attempts failed.");
        throw error; // Last attempt failed
      }

      console.log(` Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

export default retryRequest;
