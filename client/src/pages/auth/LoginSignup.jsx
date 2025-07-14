import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  lazy,
  Suspense,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

// Add CSS for animated gradients and effects
const animatedGradientStyle = `
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    25% { background-position: 50% 100%; }
    50% { background-position: 100% 50%; }
    75% { background-position: 50% 0%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes shine {
    0% { left: -100%; }
    50% { left: 100%; }
    100% { left: 100%; }
  }

  @keyframes pulse {
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.5); }
    50% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(16, 185, 129, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
  }

  @keyframes float {
    0% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-15px) rotate(5deg); }
    50% { transform: translateY(-20px) rotate(0deg); }
    75% { transform: translateY(-8px) rotate(-5deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }

  @keyframes glow {
    0% { box-shadow: 0 0 15px rgba(16, 185, 129, 0.7), 0 0 25px rgba(249, 115, 22, 0.5); }
    50% { box-shadow: 0 0 35px rgba(16, 185, 129, 1), 0 0 50px rgba(249, 115, 22, 0.8); }
    100% { box-shadow: 0 0 15px rgba(16, 185, 129, 0.7), 0 0 25px rgba(249, 115, 22, 0.5); }
  }

  @keyframes color-shift {
    0% { border-color: rgba(249, 115, 22, 0.7); }
    33% { border-color: rgba(234, 88, 12, 0.7); }
    66% { border-color: rgba(251, 146, 60, 0.7); }
    100% { border-color: rgba(249, 115, 22, 0.7); }
  }

  @keyframes wave {
    0% { transform: rotate(0deg) scale(1); }
    25% { transform: rotate(10deg) scale(1.05); }
    50% { transform: rotate(0deg) scale(1.07); }
    75% { transform: rotate(-10deg) scale(1.05); }
    100% { transform: rotate(0deg) scale(1); }
  }

  @keyframes morph {
    0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    33% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
    66% { border-radius: 50% 60% 30% 60% / 40% 30% 60% 50%; }
    100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  }

  @keyframes cosmic {
    0% { background-position: 0% 0%; }
    50% { background-position: 100% 100%; }
    100% { background-position: 0% 0%; }
  }

  @keyframes sparkle {
    0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
    20% { opacity: 1; transform: scale(1.5) rotate(45deg); }
    50% { opacity: 0.8; transform: scale(1.2) rotate(180deg); }
    80% { opacity: 1; transform: scale(1.5) rotate(315deg); }
  }

  @keyframes rainbow-text {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes bubble-float {
    0%, 100% { transform: translateY(0) scale(1); opacity: 0.7; }
    50% { transform: translateY(-40px) scale(1.2); opacity: 0.9; }
  }

  @keyframes magnetic-pull {
    0% { transform: translateX(0) translateY(0); }
    25% { transform: translateX(3px) translateY(-3px); }
    50% { transform: translateX(0) translateY(0); }
    75% { transform: translateX(-3px) translateY(3px); }
    100% { transform: translateX(0) translateY(0); }
  }

  @keyframes liquid-fill {
    0% { height: 0%; }
    100% { height: 100%; }
  }

  @keyframes neon-pulse {
    0%, 100% { text-shadow: 0 0 5px rgba(16, 185, 129, 0.7), 0 0 10px rgba(16, 185, 129, 0.7), 0 0 15px rgba(16, 185, 129, 0.7), 0 0 20px rgba(16, 185, 129, 0.7); }
    50% { text-shadow: 0 0 10px rgba(249, 115, 22, 0.9), 0 0 20px rgba(249, 115, 22, 0.9), 0 0 30px rgba(249, 115, 22, 0.9), 0 0 40px rgba(249, 115, 22, 0.9); }
    100% { text-shadow: 0 0 5px rgba(16, 185, 129, 0.7), 0 0 25px rgba(249, 115, 22, 0.5); }
  }

  .cosmic-bg {
    background-image: 
      radial-gradient(circle at 20% 30%, rgba(249, 115, 22, 0.4) 0%, transparent 50%),
      radial-gradient(circle at 70% 60%, rgba(251, 146, 60, 0.4) 0%, transparent 60%),
      radial-gradient(circle at 40% 80%, rgba(249, 115, 22, 0.4) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(234, 88, 12, 0.4) 0%, transparent 60%);
    background-size: 250% 250%;
    animation: cosmic 18s infinite alternate;
    position: absolute;
    inset: 0;
    z-index: 0;
    opacity: 0.8;
  }

  .sparkle {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: white;
    box-shadow: 0 0 15px 5px rgba(255, 255, 255, 0.9);
    animation: sparkle 4s infinite;
    z-index: 10;
    opacity: 0;
  }

  .sparkle-1 { top: 10%; left: 20%; animation-delay: 0s; }
  .sparkle-2 { top: 30%; left: 80%; animation-delay: 0.5s; }
  .sparkle-3 { top: 70%; left: 15%; animation-delay: 1s; }
  .sparkle-4 { top: 60%; left: 90%; animation-delay: 1.5s; }
  .sparkle-5 { top: 90%; left: 40%; animation-delay: 2s; }
  .sparkle-6 { top: 20%; left: 60%; animation-delay: 2.5s; }
  .sparkle-7 { top: 40%; left: 30%; animation-delay: 3s; }
  .sparkle-8 { top: 80%; left: 75%; animation-delay: 3.5s; }
  .sparkle-9 { top: 15%; left: 45%; animation-delay: 1.2s; }
  .sparkle-10 { top: 55%; left: 25%; animation-delay: 2.2s; }
  .sparkle-11 { top: 75%; left: 55%; animation-delay: 0.7s; }
  .sparkle-12 { top: 35%; left: 85%; animation-delay: 1.7s; }

  .morph-blob {
    animation: morph 8s ease-in-out infinite;
  }

  .bubble {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.2));
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
    animation: bubble-float 8s infinite;
    opacity: 0.7;
    z-index: 5;
  }

  .bubble-1 { width: 30px; height: 30px; left: 10%; top: 90%; animation-delay: 0s; }
  .bubble-2 { width: 20px; height: 20px; left: 20%; top: 85%; animation-delay: 1s; }
  .bubble-3 { width: 35px; height: 35px; left: 30%; top: 88%; animation-delay: 2s; }
  .bubble-4 { width: 25px; height: 25px; left: 40%; top: 92%; animation-delay: 3s; }
  .bubble-5 { width: 40px; height: 40px; left: 50%; top: 85%; animation-delay: 4s; }
  .bubble-6 { width: 18px; height: 18px; left: 60%; top: 90%; animation-delay: 2.5s; }
  .bubble-7 { width: 32px; height: 32px; left: 70%; top: 87%; animation-delay: 1.5s; }
  .bubble-8 { width: 22px; height: 22px; left: 80%; top: 92%; animation-delay: 3.5s; }

  .form-card {
    position: relative;
    z-index: 10;
    backdrop-filter: blur(5px);
  }

  .submitting input, .submitting button {
    animation: pulse 1s infinite;
  }

  .input-focus-effect:focus {
    animation: color-shift 3s infinite !important;
    transform: translateY(-5px);
    transition: all 0.3s ease;
  }

  @keyframes shimmer {
    0% { background-position: -150% 0; }
    50% { background-position: 250% 0; }
    100% { background-position: 250% 0; }
  }
  
  @keyframes shine {
    0% {
      left: -100%;
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    50% {
      left: 100%;
      opacity: 1;
    }
    100% {
      left: 100%;
      opacity: 0;
    }
  }
  
  .shine-effect::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -100%;
    width: 50%;
    height: 200%;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent);
    transform: rotate(25deg);
    animation: shine 3s ease-in-out infinite;
  }

  .btn-shine {
    position: relative;
    overflow: hidden;
  }

  .btn-shine::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 80%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
    animation: shine 1.5s infinite;
  }

  .input-focus-effect:focus {
    border-color: #10B981;
    box-shadow: 0 0 0 5px rgba(16, 185, 129, 0.4), 0 0 0 10px rgba(249, 115, 22, 0.2);
    animation: pulse 2s infinite;
  }

  .floating-logo {
    animation: float 6s ease-in-out infinite;
  }

  .glowing-border {
    animation: glow 3s infinite;
  }

  .shimmer-effect {
    background: linear-gradient(90deg, rgba(16, 185, 129, 0), rgba(16, 185, 129, 0.6), rgba(249, 115, 22, 0.6), rgba(16, 185, 129, 0));
    background-size: 400% 100%;
    animation: shimmer 3s infinite;
  }

  @keyframes blob {
    0% {
      transform: translate(0px, 0px) scale(1);
    }
    33% {
      transform: translate(40px, -60px) scale(1.2);
    }
    66% {
      transform: translate(-30px, 30px) scale(0.8);
    }
    100% {
      transform: translate(0px, 0px) scale(1);
    }
  }

  .animate-blob {
    animation: blob 12s infinite;
  }

  .animation-delay-2000 {
    animation-delay: 2s;
  }

  .animation-delay-4000 {
    animation-delay: 4s;
  }

  .animation-delay-6000 {
    animation-delay: 6s;
  }

  .bg-gradient-teal-orange {
    background: linear-gradient(135deg, #0D9488 0%, #F97316 50%, #0D9488 100%);
    background-size: 200% 200%;
    animation: gradient 8s ease infinite;
  }

  /* Removing 3D hover effect */

  .text-gradient {
    background: linear-gradient(90deg, #0D9488, #F97316, #0D9488);
    background-size: 300% 100%;
    animation: gradient 8s ease infinite;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  .rainbow-text {
    background: linear-gradient(to right, 
      #0D9488, 
      #14B8A6, 
      #F97316, 
      #FB923C, 
      #0D9488);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
    animation: rainbow-text 3s linear infinite;
  }

  .magnetic-button {
    transition: all 0.3s ease;
  }

  .magnetic-button:hover {
    animation: magnetic-pull 2s ease infinite;
  }

  .liquid-fill {
    position: relative;
    overflow: hidden;
  }

  .liquid-fill::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0%;
    background: linear-gradient(to top, rgba(16, 185, 129, 0.3), rgba(249, 115, 22, 0.2));
    animation: liquid-fill 1s ease forwards;
    z-index: -1;
    transition: height 0.5s ease;
  }

  .liquid-fill:hover::before {
    height: 100%;
    animation: liquid-fill 0.5s ease forwards;
  }

  .neon-text {
    animation: neon-pulse 2s infinite alternate;
  }
`;

const LoginSignup = () => {
  // Add style element for animations
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = animatedGradientStyle;
    document.head.appendChild(styleEl);
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoverButton, setHoverButton] = useState(false);

  // Track mouse position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    setIsVisible(true);

    // Add extra animation effect
    const timeout = setTimeout(() => {
      const formCard = document.querySelector(".form-card");
      if (formCard) formCard.classList.add("animate-pulse");

      setTimeout(() => {
        if (formCard) formCard.classList.remove("animate-pulse");
      }, 1500);
    }, 2000);

    // Add random burst effects
    const burstInterval = setInterval(() => {
      const x = Math.random() * 100;
      const y = Math.random() * 100;

      const burst = document.createElement("div");
      burst.className = "absolute w-1 h-1 bg-white rounded-full z-20";
      burst.style.left = `${x}vw`;
      burst.style.top = `${y}vh`;
      burst.style.boxShadow = "0 0 20px 10px rgba(255, 255, 255, 0.8)";
      burst.style.animation = "sparkle 1.5s forwards";

      document.body.appendChild(burst);

      setTimeout(() => {
        document.body.removeChild(burst);
      }, 1500);
    }, 3000);

    return () => {
      clearTimeout(timeout);
      clearInterval(burstInterval);
    };
  }, []);

  // Toggle between login and signup with enhanced animation
  const toggleForm = useCallback(() => {
    setIsLogin((prev) => !prev);
    setErrors({});
  }, []);

  // Handle form input changes
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear error for this field when typing
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }

      // Add ripple effect to input
      const input = e.target;
      const ripple = document.createElement("div");
      ripple.className =
        "absolute w-full h-full bg-teal-500 rounded-md opacity-20";
      ripple.style.animation = "pulse 1s forwards";

      input.parentNode.appendChild(ripple);

      setTimeout(() => {
        input.parentNode.removeChild(ripple);
      }, 1000);
    },
    [errors],
  );

  // Validate form input
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Additional validations for signup
    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = "Name is required";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isLogin]);

  // Handle form submission with enhanced animation
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (validateForm()) {
        setLoading(true);

        // Add submission animation effect
        const formEl = e.target;
        formEl.classList.add("submitting");

        // Explosion effect on submit
        for (let i = 0; i < 20; i++) {
          const particle = document.createElement("div");
          const size = Math.random() * 10 + 5;
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 100 + 50;
          const duration = Math.random() * 1 + 0.5;

          const startX = window.innerWidth / 2;
          const startY = window.innerHeight / 2;
          const endX = startX + Math.cos(angle) * distance;
          const endY = startY + Math.sin(angle) * distance;

          particle.className = "fixed w-3 h-3 rounded-full z-50";
          particle.style.width = `${size}px`;
          particle.style.height = `${size}px`;
          particle.style.background = i % 2 === 0 ? "#0D9488" : "#F97316";
          particle.style.boxShadow =
            i % 2 === 0
              ? "0 0 10px 5px rgba(13, 148, 136, 0.7)"
              : "0 0 10px 5px rgba(249, 115, 22, 0.7)";
          particle.style.left = `${startX}px`;
          particle.style.top = `${startY}px`;
          particle.style.opacity = "1";
          particle.style.transition = `all ${duration}s cubic-bezier(.09,.93,.16,.99)`;

          document.body.appendChild(particle);

          setTimeout(() => {
            particle.style.transform = "scale(0.3)";
            particle.style.left = `${endX}px`;
            particle.style.top = `${endY}px`;
            particle.style.opacity = "0";
          }, 10);

          setTimeout(() => {
            document.body.removeChild(particle);
          }, duration * 1000);
        }

        // Simulate API call
        setTimeout(() => {
          console.log("Form submitted:", formData);
          setLoading(false);
          formEl.classList.remove("submitting");
          // Here you would normally handle authentication with a backend
          alert(
            isLogin ? "Login successful!" : "Account created successfully!",
          );
        }, 1500);
      }
    },
    [formData, isLogin, validateForm],
  );

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, staggerChildren: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, rotateX: -30 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.7, ease: [0.17, 0.67, 0.83, 0.67] },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.7, rotate: -15 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 1.2,
        ease: [0.43, 0.13, 0.23, 0.96],
        type: "spring",
        stiffness: 250,
      },
    },
  };

  // We don't need the 3D effect calculation anymore
  return (
    <div className="min-h-screen bg-white flex overflow-hidden relative">
      {/* Cosmic background */}
      <div className="cosmic-bg"></div>

      {/* Enhanced sparkles */}
      <div className="sparkle sparkle-1"></div>
      <div className="sparkle sparkle-2"></div>
      <div className="sparkle sparkle-3"></div>
      <div className="sparkle sparkle-4"></div>
      <div className="sparkle sparkle-5"></div>
      <div className="sparkle sparkle-6"></div>
      <div className="sparkle sparkle-7"></div>
      <div className="sparkle sparkle-8"></div>
      <div className="sparkle sparkle-9"></div>
      <div className="sparkle sparkle-10"></div>
      <div className="sparkle sparkle-11"></div>
      <div className="sparkle sparkle-12"></div>

      {/* Removed strips */}

      {/* Left side - Logo and branding */}
      <div className="w-1/2 bg-white p-8 flex items-center justify-center relative hidden md:flex">
        <div className="cosmic-bg"></div>

        <motion.div 
          className="z-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo with enhanced animations */}
          <motion.div className="flex justify-center" variants={logoVariants}>
            <motion.div
              className="relative w-52 h-52 flex items-center justify-center mb-6 floating-logo"
              whileHover={{
                scale: 1.1,
                rotate: [0, 5, -5, 0],
                transition: { duration: 0.7 },
              }}
            >
              {/* The logo image with enhanced animation */}
              <motion.img
                src="http://uptoskills.com/wp-content/uploads/2023/04/hd-logo-iguru.png"
                alt="UpToSkills Logo"
                className="w-52 h-52 object-contain relative z-10"
                animate={{
                  scale: [1, 1.08, 1],
                  rotate: [0, 7, 0, -7, 0],
                  y: [0, -8, 0, 8, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={{
                  scale: 1.25,
                  rotate: [0, 15, 0, -15, 0],
                  transition: { duration: 1.2 },
                }}
              />
            </motion.div>
          </motion.div>

          <motion.h2
            className="mt-2 text-center text-4xl font-extrabold text-white"
            variants={itemVariants}
            style={{
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)"
            }}
          >
            Welcome to UpToSkills
          </motion.h2>
          <motion.p
            className="mt-6 text-center text-lg text-white"
            variants={itemVariants}
            style={{
              textShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
            }}
          >
            Your journey to excellence starts here
          </motion.p>
        </motion.div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden relative">
        <AnimatePresence>
          {isVisible && (
            <motion.div
              className="sm:mx-auto sm:w-full sm:max-w-md z-10"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Only show logo on mobile since we have it on the left panel for desktop */}
              <div className="md:hidden">
                <motion.div className="flex justify-center" variants={logoVariants}>
                  <motion.div
                    className="relative w-32 h-32 flex items-center justify-center mb-6 floating-logo"
                  >
                    <motion.img
                      src="http://uptoskills.com/wp-content/uploads/2023/04/hd-logo-iguru.png"
                      alt="UpToSkills Logo"
                      className="w-24 h-24 object-contain relative z-10"
                    />
                  </motion.div>
                </motion.div>
              </div>

              <motion.h2
                className="mt-2 text-center text-4xl font-extrabold text-gray-800"
                variants={itemVariants}
              >
                {isLogin ? "Welcome Back!" : "Join Our Community"}
              </motion.h2>
              <motion.p
                className="mt-3 text-center text-lg text-gray-600 font-medium"
                variants={itemVariants}
              >
                {isLogin ? "Sign in to your account" : "Create your account"}
              </motion.p>
              <motion.p
                className="mt-3 text-center text-sm text-gray-600"
                variants={itemVariants}
              >
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <motion.button
                  onClick={toggleForm}
                  className="font-medium text-orange-500 hover:text-teal-600 focus:outline-none transition-all duration-300"
                  whileHover={{scale: 1.15,
                    y: -5,
                    color: "#0D9488",
                  }}                  whileTap={{ scale: 0.85 }}
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </motion.button>
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "signup"}
            className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              {/* Card content */}
              <motion.div
                className="bg-white py-10 px-6 shadow-xl sm:rounded-xl sm:px-12 border border-gray-100 relative form-card"
                whileHover={{
                  boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.2)",
                }}
              >
                <motion.form
                  className="space-y-6"
                  onSubmit={handleSubmit}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.01 }}
                >
                  {/* Name field - only for signup */}
                  <AnimatePresence>
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <motion.div variants={itemVariants}>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-300"
                          >
                            Full Name
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <motion.svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-500"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                animate={{
                                  scale: [1, 1.2, 1],
                                  rotate: [0, 10, 0],
                                  color: ["#6B7280", "#10B981", "#6B7280"],
                                }}
                                transition={{
                                  duration: 3,
                                  repeat: Infinity,
                                  repeatType: "reverse",
                                }}
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                  clipRule="evenodd"
                                />
                              </motion.svg>
                            </div>
                            <motion.input
                              id="name"
                              name="name"
                              type="text"
                              autoComplete="name"
                              value={formData.name}
                              onChange={handleChange}
                              whileFocus={{ scale: 1.01 }}
                              className={`pl-10 appearance-none block w-full px-3 py-3 bg-white border ${errors.name ? "border-red-500" : "border-orange-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-700 sm:text-sm transition-all duration-300 input-focus-effect liquid-fill`}
                              placeholder="John Doe"
                              aria-label="Full name"
                            />
                            {errors.name && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 text-sm text-red-500"
                                id="name-error"
                              >
                                {errors.name}
                              </motion.p>
                            )}
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email field */}
                  <motion.div variants={itemVariants}>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Email address
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <motion.svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, 0],
                            color: ["#6B7280", "#F97316", "#6B7280"],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: 0.5,
                          }}
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </motion.svg>
                      </div>
                      <motion.input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        whileFocus={{ scale: 1.01 }}
                        className={`pl-10 appearance-none block w-full px-3 py-3 bg-white border ${errors.email ? "border-red-500" : "border-orange-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-700 sm:text-sm transition-all duration-300 input-focus-effect liquid-fill`}
                        placeholder="you@example.com"
                        aria-label="Email address"
                      />
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-500"
                          id="email-error"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>

                  {/* Password field */}
                  <motion.div variants={itemVariants}>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <motion.svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, 0],
                            color: ["#6B7280", "#10B981", "#6B7280"],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: 1,
                          }}
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </motion.svg>
                      </div>
                      <motion.input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete={
                          isLogin ? "current-password" : "new-password"
                        }
                        value={formData.password}
                        onChange={handleChange}
                        whileFocus={{ scale: 1.01 }}
                        className={`pl-10 appearance-none block w-full px-3 py-3 bg-white border ${errors.password ? "border-red-500" : "border-orange-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-700 sm:text-sm transition-all duration-300 input-focus-effect liquid-fill`}
                        placeholder="••••••••"
                        aria-label="Password"
                      />
                      {errors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-500"
                          id="password-error"
                        >
                          {errors.password}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>

                  {/* Confirm Password field - only for signup */}
                  <AnimatePresence>
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <motion.div variants={itemVariants}>
                          <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-300"
                          >
                            Confirm Password
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <motion.svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-500"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                animate={{
                                  scale: [1, 1.2, 1],
                                  rotate: [0, 10, 0],
                                  color: ["#6B7280", "#F97316", "#6B7280"],
                                }}
                                transition={{
                                  duration: 3,
                                  repeat: Infinity,
                                  repeatType: "reverse",
                                  delay: 1.5,
                                }}
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                  clipRule="evenodd"
                                />
                              </motion.svg>
                            </div>
                            <motion.input
                              id="confirmPassword"
                              name="confirmPassword"
                              type="password"
                              autoComplete="new-password"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              whileFocus={{ scale: 1.01 }}
                              className={`pl-10 appearance-none block w-full px-3 py-3 bg-white border ${errors.confirmPassword ? "border-red-500" : "border-orange-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-700 sm:text-sm transition-all duration-300 input-focus-effect liquid-fill`}
                              placeholder="••••••••"
                              aria-label="Confirm password"
                            />
                            {errors.confirmPassword && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 text-sm text-red-500"
                                id="confirm-password-error"
                              >
                                {errors.confirmPassword}
                              </motion.p>
                            )}
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Remember me & Forgot password - only for login */}
                  <AnimatePresence>
                    {isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <motion.div
                          className="flex items-center justify-between"
                          variants={itemVariants}
                        >
                          <div className="flex items-center">
                            <input
                              id="remember-me"
                              name="remember-me"
                              type="checkbox"
                              className="h-4 w-4 bg-white text-orange-500 focus:ring-orange-500 border-orange-300 rounded transition-all duration-300"
                              aria-label="Remember me"
                            />
                            <label
                              htmlFor="remember-me"
                              className="ml-2 block text-sm text-gray-600"
                            >
                              Remember me
                            </label>
                          </div>

                          <div className="text-sm">
                            <a
                              href="#"
                              className="font-medium text-orange-500 hover:text-teal-400 transition-all duration-300"
                              aria-label="Forgot your password"
                            >
                              Forgot password?
                            </a>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit button */}
                  <motion.div variants={itemVariants}>
                    <motion.button
                      type="submit"
                      whileHover={{
                        scale: 1.05,
                        boxShadow:
                          "0 0 60px rgba(249, 115, 22, 0.9), 0 0 30px rgba(16, 185, 129, 0.7)",
                        y: -5,
                      }}
                      whileTap={{
                        scale: 0.95,
                        boxShadow:
                          "0 0 30px rgba(249, 115, 22, 0.6), 0 0 15px rgba(16, 185, 129, 0.5)",
                      }}
                      onHoverStart={() => setHoverButton(true)}
                      onHoverEnd={() => setHoverButton(false)}
                      disabled={loading}
                      className="w-full flex justify-center py-4 px-6 border-none rounded-xl shadow-2xl text-xl font-extrabold text-white bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 hover:from-orange-600 hover:via-orange-500 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 disabled:opacity-70 overflow-hidden shine-effect"
                      style={{
                        backgroundSize: "200% auto",
                        animation: "gradient 3s ease infinite",
                        background: "linear-gradient(45deg, #F97316, #FB923C, #F97316, #EA580C, #F97316)",
                        letterSpacing: "0.1em",
                        textShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
                        position: "relative",
                      }}
                      animate={{
                        y: [0, -3, 0],
                        boxShadow: [
                          "0 10px 30px rgba(249, 115, 22, 0.7), 0 6px 20px rgba(16, 185, 129, 0.5)",
                          "0 15px 40px rgba(249, 115, 22, 0.9), 0 8px 30px rgba(16, 185, 129, 0.7)",
                          "0 10px 30px rgba(249, 115, 22, 0.7), 0 6px 20px rgba(16, 185, 129, 0.5)",
                        ],
                        scale: [1, 1.02, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      aria-label={isLogin ? "Sign in" : "Sign up"}
                    >
                      {loading ? (
                        <motion.svg
                          className="h-6 w-6 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          animate={{
                            rotate: 360,
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            rotate: {
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            },
                            scale: {
                              duration: 0.5,
                              repeat: Infinity,
                              repeatType: "reverse",
                            },
                          }}
                        >
                          <circle
                            className="opacity-20"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-90"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </motion.svg>
                      ) : (
                        <motion.div
                          className="relative flex items-center justify-center w-full"
                          animate={{
                            textShadow: [
                              "0 0 10px rgba(255, 255, 255, 0.7)",
                              "0 0 20px rgba(255, 255, 255, 0.9)",
                              "0 0 10px rgba(255, 255, 255, 0.7)",
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        >
                          {/* Star burst effect when hovering */}
                          {hoverButton && (
                            <>
                              {[...Array(12)].map((_, i) => {
                                const randomX = Math.random() * 60 - 30;
                                const randomY = Math.random() * 60 - 30;
                                const size = Math.random() * 3 + 1;
                                const duration = Math.random() * 0.8 + 0.6;
                                const delay = Math.random() * 0.4;
                                const color = i % 3 === 0 
                                  ? "rgba(249, 115, 22, 0.9)" 
                                  : i % 3 === 1 
                                    ? "rgba(16, 185, 129, 0.9)" 
                                    : "rgba(255, 255, 255, 0.9)";
                                
                                return (
                                  <motion.div
                                    key={i}
                                    className="absolute rounded-full"
                                    style={{
                                      width: `${size}px`,
                                      height: `${size}px`,
                                      backgroundColor: color,
                                      boxShadow: `0 0 ${size * 3}px ${size}px ${color}`
                                    }}
                                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                                    animate={{
                                      opacity: [0, 1, 0],
                                      scale: [0, 1.5, 0],
                                      x: [0, randomX],
                                      y: [0, randomY],
                                    }}
                                    transition={{ 
                                      duration: duration, 
                                      repeat: Infinity, 
                                      delay: delay,
                                      ease: "easeOut"
                                    }}
                                  />
                                );
                              })}
                            </>
                          )}

                          <span>{isLogin ? "Sign in" : "Sign up"}</span>
                        </motion.div>
                      )}
                    </motion.button>
                  </motion.div>
                </motion.form>

                {/* Social login section */}
                <div className="mt-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <motion.div
                        className="w-full border-t border-gray-300"
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      ></motion.div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <motion.span
                        className="px-2 bg-white text-gray-500"
                        animate={{
                          y: [0, -2, 0],
                          scale: [1, 1.05, 1],
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        Or continue with
                      </motion.span>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-3 gap-6">
                    <motion.a
                      href="#"
                      whileHover={{
                        scale: 1.2,
                        y: -10,
                        boxShadow: "0 20px 35px -8px rgba(0, 0, 0, 0.3)",
                        rotate: [0, 3, 0, -3, 0],
                        transition: { duration: 0.5 },
                      }}
                      whileTap={{
                        scale: 0.85,
                        boxShadow: "0 8px 15px -5px rgba(0, 0, 0, 0.2)",
                      }}
                      className="w-full inline-flex justify-center py-2 px-3 border border-gray-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm text-xs font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 shimmer-effect"
                      style={{
                        perspective: "1200px",
                        transformStyle: "preserve-3d",
                      }}
                      aria-label="Sign in with Google"
                    >
                      <motion.div
                        animate={{
                          rotateY: [0, 15, 0, -15, 0],
                        }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <svg
                          className="w-6 h-6 text-black"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                        </svg>
                      </motion.div>
                    </motion.a>

                    <motion.a
                      href="#"
                      whileHover={{
                        scale: 1.2,
                        y: -10,
                        boxShadow: "0 20px 35px -8px rgba(0, 0, 0, 0.3)",
                        rotate: [0, 3, 0, -3, 0],
                        transition: { duration: 0.5 },
                      }}
                      whileTap={{
                        scale: 0.85,
                        boxShadow: "0 8px 15px -5px rgba(0, 0, 0, 0.2)",
                      }}
                      className="w-full inline-flex justify-center py-2 px-3 border border-gray-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm text-xs font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 shimmer-effect"
                      style={{
                        perspective: "1200px",
                        transformStyle: "preserve-3d",
                      }}
                      aria-label="Sign in with Facebook"
                    >
                      <motion.div
                        animate={{
                          rotateY: [0, -15, 0, 15, 0],
                        }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.5,
                        }}
                      >
                        <svg
                          className="w-6 h-6 text-black"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </motion.div>
                    </motion.a>

                    <motion.a
                      href="#"
                      whileHover={{
                        scale: 1.2,
                        y: -10,
                        boxShadow: "0 20px 35px -8px rgba(0, 0, 0, 0.3)",
                        rotate: [0, 3, 0, -3, 0],
                        transition: { duration: 0.5 },
                      }}
                      whileTap={{
                        scale: 0.85,
                        boxShadow: "0 8px 15px -5px rgba(0, 0, 0, 0.2)",
                      }}
                      className="w-full inline-flex justify-center py-2 px-3 border border-gray-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm text-xs font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 shimmer-effect"
                      style={{
                        perspective: "1200px",
                        transformStyle: "preserve-3d",
                      }}
                      aria-label="Sign in with Twitter"
                    >
                      <motion.div
                        animate={{
                          rotateY: [0, 15, 0, -15, 0],
                        }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1,
                        }}
                      >
                        <svg
                          className="w-6 h-6 text-black"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 0 002.46-2.548l-.047-.02z" />
                        </svg>
                      </motion.div>
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer with enhanced styling */}
        <motion.div
          className="absolute bottom-4 w-full text-center relative z-10 md:pr-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          style={{ position: 'absolute', bottom: '10px' }} // Ensure it sticks to the bottom
        >
          <motion.p
            className="text-sm text-gray-600 font-medium"
          >
            © {new Date().getFullYear()} UpToSkills. All rights reserved.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginSignup;