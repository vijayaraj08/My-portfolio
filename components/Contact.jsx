import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";

import { slideIn } from "../utils/motion";

function Contact() { 
  const formRef = useRef();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value);
    console.log(`Updating ${name} with value: ${sanitizedValue}`); // Log form field updates

    setForm({ ...form, [name]: sanitizedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submit triggered");

    // Validation checks
    if (!form.name || !form.email || !form.message) {
      console.log("Form validation failed: All fields are required.");
      alert("All fields are required.");
      return;
    }

    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!emailPattern.test(form.email)) {
      console.log("Form validation failed: Invalid email address.");
      alert("Please enter a valid email address.");
      return;
    }
    const phonePattern = /^\+?[0-9]{10,15}$/; // Validates phone numbers
    if (!phonePattern.test(form.phone)) {
      alert("Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    console.log("Loading state set to true");

    try {
      console.log("Sending data to /api/contact...");
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
        }),
      });
      console.log(response,"kkkkkkkkkkkkkkkkkkkkkkkk")

      const result = await response.json();
      console.log("Response from /api/contact:", result);

      if (response.ok) {
        console.log("Form submission successful");
        alert("Thank you for your message. I will get back to you soon.");
        setForm({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        console.log("Form submission failed", result.error);
        alert(result.error || "Something went wrong. Please try again later.");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
      console.log("Loading state set to false");
    }
  };

  return (
    <motion.div
      variants={slideIn("left", "tween", 0.2, 1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="xl:my-36 md:w-2/5 w-full bg-bgSecondaryDark xl:ml-36 lg:ml-16 md:ml-10 p-8 rounded-2xl shadow-md shadow-primary"
      id="contact"
    >
      <p className={"sectionSubText text-ctnSecondaryDark"}>Get in touch</p>
      <h3 className={"sectionHeadText text-ctnPrimaryDark"}>Contact.</h3>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col gap-8"
      >
        <label className="flex flex-col">
          <span className="text-ctnPrimaryDark font-medium mb-4">
            Your Name
          </span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="What is your good name?"
            className="bg-bgPrimaryDark py-4 px-6 placeholder:text-ctnSecondaryDark rounded-lg outline-none border-none font-medium text-ctnPrimaryDark  placeholder:text-sm md:placeholder:text-lg h-fit placeholder:break-words break-words"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-ctnPrimaryDark  font-medium mb-4">
            Your email
          </span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="What is your email address?"
            className="bg-bgPrimaryDark py-4 px-6 placeholder:text-ctnSecondaryDark rounded-lg outline-none border-none font-medium text-ctnPrimaryDark  placeholder:text-sm md:placeholder:text-lg h-fit placeholder:break-words break-words"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-ctnPrimaryDark font-medium mb-4">Your Phone</span>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="What is your phone number?"
            className="bg-bgPrimaryDark py-4 px-6 placeholder:text-ctnSecondaryDark rounded-lg outline-none border-none font-medium text-ctnPrimaryDark placeholder:text-sm md:placeholder:text-lg h-fit"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-ctnPrimaryDark  font-medium mb-4">
            Your Message
          </span>
          <textarea
            rows={4}
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            placeholder="What do you want to say?"
            className="bg-bgPrimaryDark py-4 px-6 placeholder:text-ctnSecondaryDark rounded-lg outline-none border-none font-medium text-ctnPrimaryDark  placeholder:text-sm md:placeholder:text-lg h-fit placeholder:break-words break-words"
          />
        </label>

        <button
          type="submit"
          className="bg-primary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-tertiary hover:shadow-primary hover:bg-tertiary transition-all duration-800 ease-in"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </motion.div>
  );
}

export default Contact;
