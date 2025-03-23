import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  Send,
  ArrowRight,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";

const ContactPage = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    guests: "1-2",
    date: "",
    time: "",
    topic: "reservation",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    console.log("Form submitted:", formState);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormState({
        name: "",
        email: "",
        phone: "",
        message: "",
        guests: "1-2",
        date: "",
        time: "",
        topic: "reservation",
      });
    }, 3000);
  };

  // Restaurant details
  const restaurantInfo = {
    name: "Bistro Moderne",
    address: "123 Culinary Avenue, Gourmet District",
    city: "New York, NY 10001",
    phone: "(212) 555-1234",
    email: "reservations@bistromoderne.com",
    hours: [
      { days: "Monday - Thursday", time: "11:00 AM - 10:00 PM" },
      { days: "Friday - Saturday", time: "11:00 AM - 11:00 PM" },
      { days: "Sunday", time: "10:00 AM - 9:00 PM" },
    ],
    socialMedia: [
      { name: "Instagram", url: "#" },
      { name: "Facebook", url: "#" },
      { name: "Twitter", url: "#" },
    ],
  };

  return (
    <div className="bg-white min-h-screen mt-20">
      {/* Hero section with background image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src="https://plus.unsplash.com/premium_photo-1670984940156-c7f833fe8397?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmVzdGF1cmFudCUyMGludGVyaW9yfGVufDB8fDB8fHww"
          alt="Restaurant interior"
          className="absolute w-full h-full object-cover items-center"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Contact Us
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact information section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {restaurantInfo.name}
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              We'd love to hear from you. Whether you're looking to make a
              reservation, have a question about our menu, or want to provide
              feedback, we're here to help.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <MapPin className="h-6 w-6 text-red-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Location
                  </h3>
                  <p className="mt-1 text-gray-600">{restaurantInfo.address}</p>
                  <p className="text-gray-600">{restaurantInfo.city}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Phone className="h-6 w-6 text-red-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                  <p className="mt-1 text-gray-600">{restaurantInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Mail className="h-6 w-6 text-red-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Email</h3>
                  <p className="mt-1 text-gray-600">{restaurantInfo.email}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-red-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Hours</h3>
                  <div className="mt-1 space-y-1">
                    {restaurantInfo.hours.map((item, index) => (
                      <div key={index} className="text-gray-600">
                        <span className="font-medium">{item.days}:</span>{" "}
                        {item.time}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="mt-8 h-64 bg-gray-200 rounded-lg overflow-hidden relative">
              <img
                src="/api/placeholder/800/400"
                alt="Map location"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="bg-white px-4 py-2 rounded-md shadow-md text-gray-700">
                  Interactive Map Would Appear Here
                </p>
              </div>
            </div>

            {/* Social media */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Follow Us
              </h3>
              <div className="flex space-x-4">
                {restaurantInfo.socialMedia.map((platform, index) => (
                  <a
                    key={index}
                    href={platform.url}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md transition-colors"
                  >
                    {platform.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
            {isSubmitted ? (
              <div className="text-center py-16">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Message Received!
                </h3>
                <p className="text-gray-600">
                  Thank you for contacting us. We'll get back to you shortly.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Send Us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="topic"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      I'm contacting about
                    </label>
                    <select
                      id="topic"
                      name="topic"
                      value={formState.topic}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    >
                      <option value="reservation">Making a Reservation</option>
                      <option value="feedback">Feedback</option>
                      <option value="event">Private Event</option>
                      <option value="other">Other Inquiry</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formState.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        placeholder="(123) 456-7890"
                      />
                    </div>

                    {formState.topic === "reservation" && (
                      <div>
                        <label
                          htmlFor="guests"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Number of Guests
                        </label>
                        <select
                          id="guests"
                          name="guests"
                          value={formState.guests}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        >
                          <option value="1-2">1-2 people</option>
                          <option value="3-4">3-4 people</option>
                          <option value="5-6">5-6 people</option>
                          <option value="7+">7+ people</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {formState.topic === "reservation" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="date"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Preferred Date
                        </label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={formState.date}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="time"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Preferred Time
                        </label>
                        <input
                          type="time"
                          id="time"
                          name="time"
                          value={formState.time}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>Send Message</span>
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-20 bg-gray-50 rounded-2xl p-8 md:p-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Experience Our Cuisine?
            </h2>
            <p className="text-gray-600 mb-8">
              Book a table online or download our app for exclusive offers and
              to join our loyalty program.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={"/customer/reservation"}
                className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                <span>Reserve a Table</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to={"/customer/menu"}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-800 py-3 px-6 rounded-lg font-medium border border-gray-300 transition-colors"
              >
                <span>View Menu</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
