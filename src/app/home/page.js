"use client";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function HomePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    const handleScroll = () => {
      console.log("Scroll position:", window.scrollY);
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  function scrollToGetStarted(event) {
    event.preventDefault();
    const section = document.getElementById("get-started");
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const result = await response.json();
      console.log("Form submission successful:", result);
      setFormData({ name: "", email: "", message: "" });

      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitError("Failed to send message. Please try again later.");

      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <ToastContainer />
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-center bg-gradient-to-r from-[#178573] to-[#27DEBF] text-white">
        <div className="absolute inset-0 bg-opacity-50 bg-gradient-to-r from-[#004b3f] to-[#014338]"></div>
        <div className="relative z-10 -top-12 text-center max-w-4xl">
          <h1 className="text-6xl font-extrabold mb-6 drop-shadow-lg">
            Welcome to <span className="text-[#6ce5d1]">ProdEase</span>
          </h1>
          <p className="text-2xl font-light mb-10 max-w-2xl mx-auto drop-shadow-lg">
            ProdEase is the central hub for a fictional product based
            company&apos;s team members and admins to manage all products with
            ease and efficiency.
          </p>
          <div
            onClick={scrollToGetStarted}
            className="inline-block cursor-pointer bg-[#4cae9e] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#58bdad] transition duration-300"
          >
            Get Started
          </div>
        </div>
        <div className="absolute bottom-0 w-full">
          <svg
            className="w-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
          >
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,160L120,154.7C240,149,480,139,720,160C960,181,1200,235,1320,261.3L1440,288L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      <div
        id="get-started"
        className="relative flex w-full flex-col items-center bg-white"
      >
        <a
          target="_blank"
          rel="noreferrer"
          href="https://example.com"
          className="mx-auto flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full bg-blue-100 px-7 py-2 transition-all hover:bg-blue-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 248 204"
            className="h-5 w-5 text-[#1d9bf0]"
          >
            <path
              fill="currentColor"
              d="M221.95 51.29c.15 2.17.15 4.34.15 6.53 0 66.73-50.8 143.69-143.69 143.69v-.04c-27.44.04-54.31-7.82-77.41-22.64 3.99.48 8 .72 12.02.73 22.74.02 44.83-7.61 62.72-21.66-21.61-.41-40.56-14.5-47.18-35.07 7.57 1.46 15.37 1.16 22.8-.87-23.56-4.76-40.51-25.46-40.51-49.5v-.64c7.02 3.91 14.88 6.08 22.92 6.32C11.58 63.31 4.74 33.79 18.14 10.71c25.64 31.55 63.47 50.73 104.08 52.76-4.07-17.54 1.49-35.92 14.61-48.25 20.34-19.12 52.33-18.14 71.45 2.19 11.31-2.23 22.15-6.38 32.07-12.26-3.77 11.69-11.66 21.62-22.2 27.93 10.01-1.18 19.79-3.86 29-7.95-6.78 10.16-15.32 19.01-25.20 26.16z"
            ></path>
          </svg>
          <p className="text-sm font-semibold text-[#1d9bf0]">
            Introducing ProdEase
          </p>
        </a>
        <h1 className="mt-8 max-w-sm bg-gradient-to-br from-gray-500 via-teal-500 to-gray-500 bg-clip-text text-center text-4xl font-extrabold text-transparent sm:max-w-4xl sm:text-6xl">
          Premier Hub for Managing Products
        </h1>
        <span className="mt-8 max-w-lg text-center text-xl leading-relaxed text-gray-800">
          Whether you&lsquo;re an admin or a valued member of the ProdEase
          community, dive in to seamlessly oversee and manage products and
          services.
        </span>
        <p className="mt-3 rounded border px-3 py-1 shadow">
          🚀 <span className="text-accent font-semibold">Explore</span> your
          perks as an Admin or Member
        </p>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-0 sm:gap-x-4">
          <a
            href="/register"
            className="flex flex-row items-center justify-center gap-x-2 rounded-lg text-white px-10 py-3 bg-teal-500"
          >
            <svg
              className="h-[30px] text-white"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              strokeWidth="3"
              fill="none"
            >
              <path d="M14,39.87,24.59,50.51s33-14,31.23-42.29C55.82,8.22,29.64,4.28,14,39.87Z"></path>
              <path d="M44.69,9.09a12.3,12.3,0,0,0,3.48,6.73,12.31,12.31,0,0,0,7,3.52"></path>
              <circle cx="39.46" cy="24.56" r="6.2"></circle>
              <path d="M14.89,37.82l-5.3.68a.27.27,0,0,1-.28-.37l3.93-9a2.65,2.65,0,0,1,1.88-1.53l6.59-1.38"></path>
              <path d="M26.55,49.4l-.69,5.3a.27.27,0,0,0,.37.28l9-3.92a2.69,2.69,0,0,0,1.53-1.89l1.38-6.59"></path>
              <path d="M22.21,48.13c-2.37,7.41-14.1,7.78-14.1,7.78S8,44.51,15.76,41.67"></path>
            </svg>
            Get Started By Signup
          </a>
          <a
            href="#demo"
            className="flex flex-row items-center justify-center gap-x-2 rounded-lg border border-teal-500 px-10 py-3 text-teal-500"
          >
            Learn More →
          </a>
        </div>
      </div>

      <div className="relative flex items-center pt-20 py-8 bg-white">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500">. . . . </span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      {/* About ProdEase Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-8">
            About <span className="text-[#4cae9e]">ProdEase</span>
          </h2>
          <p className="mt-4 text-lg text-gray-700 max-w-4xl mx-auto">
            ProdEase is your all-in-one product management solution within the
            ProdEase ecosystem. Whether you are an admin managing the entire
            inventory or a team member with an idea in mind, ProdEase provides a
            seamless experience tailored to your needs.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Centralized Dashboard
              </h3>
              <p className="text-gray-600">
                View and manage all product information from a single dashboard.
                Admins can also create new products effortlessly.
              </p>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Collaborative Tools
              </h3>
              <p className="text-gray-600">
                Work together, Submit a change as a member and let the admin
                review and approve it.
              </p>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Analytics & Reporting
              </h3>
              <p className="text-gray-600">
                Monitor your submissions as a membeer and pending requests as an
                admin in your profile
              </p>
            </div>
          </div>
          <div className="mt-12">
            <div
              onClick={scrollToGetStarted}
              className="bg-[#4cae9e] cursor-pointer text-white w-56 m-auto px-8 py-4 rounded-lg font-medium hover:bg-[#4cae9e] transition duration-300"
            >
              Explore ProdEase
            </div>
          </div>
        </div>
      </section>
      {/* Transition Section */}
      <div className="relative py-20 bg-gradient-to-b from-[#178573] to-[#105b4f] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold">
            Discover the Power of ProdEase
          </h2>
          <p className="mt-4 text-lg max-w-3xl mx-auto">
            Explore how ProdEase enhances its team&lsquo;s product management
            experience, providing intuitive dashboards for team members and
            admins to efficiently manage and monitor inventory.
          </p>
        </div>
      </div>

      <section id="contactus" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-4">
            <div className="mb-6 max-w-3xl text-center sm:text-center md:mx-auto md:mb-12">
              <p className="font-heading mb-4 font-bold tracking-tight text-[#4cae9e]  text-3xl sm:text-5xl ">
                Contact
              </p>
              <p className="mt-4 text-lg text-gray-700 max-w-4xl mx-auto">
                We&lsquo;re committed to providing exceptional service and
                support.
              </p>
            </div>
          </div>
          <div className="flex items-stretch justify-center">
            <div className="grid md:grid-cols-2">
              <div className="h-full pr-6">
                <p className="mt-4 text-lg text-gray-700 max-w-4xl mx-auto">
                  Reach out to us for any inquiries or support. We&lsquo;re here
                  to help you with all your questions and concerns. Let&lsquo;s
                  start a conversation and find the best solution together.
                </p>
                <br></br>
                <ul className="mb-6 md:mb-0">
                  <li className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-[#307066] text-gray-50">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
                        <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"></path>
                      </svg>
                    </div>
                    <div className="ml-4 mb-4">
                      <h3 className="mb-2 text-lg font-medium leading-6 text-gray-600">
                        Our Address
                      </h3>
                      <p className="text-gray-600 dark:text-slate-400">
                        Sr No 1/234, ProdEase
                        <br />
                        ABC, Maharashtra 12345
                      </p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-[#307066] text-gray-50">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"></path>
                        <path d="M15 7a2 2 0 0 1 2 2"></path>
                        <path d="M15 3a6 6 0 0 1 6 6"></path>
                      </svg>
                    </div>
                    <div className="ml-4 mb-4">
                      <h3 className="mb-2 text-lg font-medium leading-6 text-gray-600">
                        Contact
                      </h3>
                      <p className="text-gray-600 dark:text-slate-400">
                        Mobile: +1 (123) 456-7890
                      </p>
                      <p className="text-gray-600 dark:text-slate-400">
                        Mail: support@prodease.com
                      </p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-[#307066] text-gray-50">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
                        <path d="M12 7v5l3 3"></path>
                      </svg>
                    </div>
                    <div className="ml-4 mb-4">
                      <h3 className="mb-2 text-lg font-medium leading-6 text-gray-600">
                        Working hours
                      </h3>
                      <p className="text-gray-600 dark:text-slate-400">
                        Monday - Friday: 08:00 - 17:00
                      </p>
                      <p className="text-gray-600 dark:text-slate-400">
                        Saturday & Sunday: 08:00 - 12:00
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="card h-fit max-w-6xl p-5 md:p-12" id="form">
                <h2 className="mb-4 text-2xl font-bold ">
                  Ready to Get Started?
                </h2>
                <form id="contactForm" onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <div className="mx-0 mb-1 sm:mb-4">
                      <div className="mx-0 mb-1 sm:mb-4">
                        <label
                          htmlFor="name"
                          className="pb-1 text-xs uppercase tracking-wider"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          autoComplete="given-name"
                          placeholder="Your name"
                          className="mb-2 w-full rounded-md border border-gray-300 p-3 text-base shadow-sm "
                          required
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mx-0 mb-1 sm:mb-4">
                        <label
                          htmlFor="email"
                          className="pb-1 text-xs uppercase tracking-wider"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          autoComplete="email"
                          placeholder="Your email address"
                          className="mb-2 w-full rounded-md border border-gray-300 p-3 text-base shadow-sm "
                          required
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mx-0 mb-1 sm:mb-4">
                        <label
                          htmlFor="message"
                          className="pb-1 text-xs uppercase tracking-wider"
                        >
                          Message
                        </label>
                        <textarea
                          id="message"
                          rows="6"
                          placeholder="Your message"
                          className="mb-2 w-full rounded-md border border-gray-300 p-3 text-base shadow-sm "
                          required
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                    </div>
                    {submitError && (
                      <p className="text-red-600">{submitError}</p>
                    )}
                    <button
                      type="submit"
                      className={`inline-block rounded-lg border border-transparent px-8 py-3 text-base font-semibold text-white shadow-sm ring-1 ring-gray-900/10 transition-all hover:ring-gray-900/20 ${
                        isSubmitting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#4cae9e]"
                      }`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div style={{ height: "2px" }}></div>
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 bg-teal-500 text-white p-4 rounded-full shadow-lg hover:bg-teal-600 transition"
        >
          ↑
        </button>
      )}
    </main>
  );
}
