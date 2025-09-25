import React from 'react';

export const AboutUs: React.FC = () => {
  const developers = [
    {
      name: "Shaurya Kesarwani",
      role: "RA2411026010989",
      description: "Specialized in React and backend architecture. Implemented the core music player functionality and user interface design.",
    },
    {
      name: "Sanjay Kumar Gupta",
      role: "RA2411026010964",
      description: "Designed and implemented the circular doubly linked list structure for efficient music navigation and playlist management.",
    },
    {
      name: "Shudhanshu Kumar",
      role: "RA2411026010959",
      description: "Created the responsive UI components and enhanced user experience with smooth animations and intuitive controls.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">About Our Music System</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A modern music player built with advanced data structures for optimal performance and user experience.
        </p>
      </div>

      {/* Linked List Implementation Explanation */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🔗 Linked List Implementation</h2>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">Circular Doubly Linked List Structure</h3>
            <p className="text-gray-700 mb-3">
              Our music system uses a <strong>Circular Doubly Linked List</strong> to manage the playlist, providing seamless navigation between tracks.
            </p>
            <div className="bg-gray-50 rounded p-3 font-mono text-sm">
              <div className="text-center mb-2">Track Structure:</div>
              <div>Node: [prev] ← [Track Data] → [next]</div>
              <div className="mt-2">Circular: Last ← → First</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-green-700 mb-2">✅ Advantages</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <strong>O(1)</strong> next/previous track navigation</li>
                <li>• Seamless looping from last to first track</li>
                <li>• Memory efficient for large playlists</li>
                <li>• Dynamic playlist modification</li>
                <li>• No array shifting overhead</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-blue-700 mb-2">🎵 Implementation Details</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <code>nextTrack()</code>: current = current.next</li>
                <li>• <code>prevTrack()</code>: current = current.prev</li>
                <li>• Circular structure prevents null references</li>
                <li>• Each node stores complete track metadata</li>
                <li>• Real-time playlist updates</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-orange-700 mb-2">🔄 Core Operations</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>Navigation:</strong>
                <ul className="text-gray-700 mt-1">
                  <li>• Next: O(1)</li>
                  <li>• Previous: O(1)</li>
                  <li>• Jump to track: O(n)</li>
                </ul>
              </div>
              <div>
                <strong>Modification:</strong>
                <ul className="text-gray-700 mt-1">
                  <li>• Add track: O(1)</li>
                  <li>• Remove track: O(1)</li>
                  <li>• Reorder: O(1)</li>
                </ul>
              </div>
              <div>
                <strong>Memory:</strong>
                <ul className="text-gray-700 mt-1">
                  <li>• Space: O(n)</li>
                  <li>• No wasted allocation</li>
                  <li>• Dynamic sizing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Development Team */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">👥 Development Team</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {developers.map((dev, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                  {dev.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-xl font-bold text-gray-800">{dev.name}</h3>
                <p className="text-purple-600 font-medium">{dev.role}</p>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{dev.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Features */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🚀 Technical Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Frontend Technologies</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                React 19 with TypeScript
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Tailwind CSS for styling
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Custom Linked List implementation
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                HTML5 Audio API integration
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Backend & Database</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                Convex real-time database
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                TypeScript schema validation
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                Real-time data synchronization
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                User authentication system
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Get In Touch</h2>
        <p className="mb-4">Have questions about our implementation or want to contribute?</p>
        <div className="flex justify-center space-x-4">
          <a 
            href="https://github.com/Shaurya07dev/LL_DSA" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block"
          >
            GitHub Repository
          </a>
          <a 
            href="https://github.com/Shaurya07dev/LL_DSA/blob/main/README.md" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-purple-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-800 transition-colors inline-block"
          >
            Documentation
          </a>
        </div>
      </div>
    </div>
  );
};
