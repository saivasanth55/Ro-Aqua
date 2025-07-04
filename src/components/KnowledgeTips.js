import React, { useState } from 'react';

function KnowledgeTips() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const openModal = (details) => {
    setModalContent(details);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalContent('');
  };

  const tips = [
    {
      title: 'Regular Filter Replacement',
      content: 'Ensure timely replacement of sediment and carbon filters every 6–12 months.',
      details: 'Sediment filters capture particulates such as dirt, rust, and sand, while carbon filters remove chlorine and other organic compounds. Timely replacement ensures optimal performance and prevents damage to the RO membrane.',
    },
    {
      title: 'Membrane Maintenance',
      content: 'Service or replace the RO membrane approximately every 2–3 years.',
      details: 'The RO membrane can degrade over time due to scaling from minerals or organic fouling. Regular cleaning or timely replacement is essential to maintain purification efficiency and water quality.',
    },
    {
      title: 'Monitor TDS Levels',
      content: 'Keep Total Dissolved Solids (TDS) within the recommended range for safe consumption.',
      details: 'Use a digital TDS meter to monitor the purity of filtered water. Ideal TDS levels for drinking water typically range between 30–50 ppm. Higher values may indicate the need for filter or membrane replacement.',
    },
    {
      title: 'Water Conservation',
      content: 'Optimize system efficiency to reduce water wastage during purification.',
      details: 'RO systems discharge a portion of water as waste during filtration. Regular maintenance, proper installation, and the use of water-saving accessories can help reduce this wastewater significantly.',
    },
    {
      title: 'pH Balance',
      content: 'Maintain water pH between 6.5 and 8.5 to ensure balanced and safe drinking water.',
      details: 'RO filtration may reduce pH due to mineral removal. Using a remineralization filter or alkaline cartridge can help restore the pH balance and improve the taste and health benefits of purified water.',
    },
    {
      title: 'Pressure Switch',
      content: 'Ensure the pressure switch functions correctly to maintain safe system operation.',
      details: 'The pressure switch plays a vital role in regulating the RO system. It automatically shuts off the pump when the tank is full or when inlet pressure is low, preventing potential damage. Regular inspection helps in identifying faults early, ensuring system safety and longevity.',
    },
    {
      title: 'Filter - PPC',
      content: 'Replace the PPC filter as per manufacturer’s recommendation to avoid water quality degradation.',
      details: 'PPC (Post Carbon) filters help enhance taste and remove residual odors after the RO process. It is recommended to replace the PPC filter every 6–12 months to maintain water freshness and avoid microbial growth.',
    },
    {
      title: 'Pressure Gauge',
      content: 'Check the pressure gauge regularly to diagnose system pressure abnormalities.',
      details: 'A pressure gauge helps monitor input and output pressure levels in the RO system. A sudden drop or rise in pressure may indicate filter blockages, pump failure, or leaks. Routine pressure monitoring ensures timely maintenance and protects the RO membrane.',
    },
  ];

  const iconMap = {
    'Regular Filter Replacement': '✨',
    'Membrane Maintenance': '🧪',
    'Monitor TDS Levels': '⚡',
    'Water Conservation': '🚰',
    'pH Balance': '💧',
    'Pressure Switch': '🔧',
    'Filter - PPC': '🧴',
    'Pressure Gauge': '📈',
  };

  return (
    <div className="content-card">
      <h2><i className="fas fa-book"></i> Knowledge & Tips</h2>
      <div className="tips-container">
        {tips.map((tip, index) => (
          <div className="tip-card" key={index}>
            <h3>
              <span className="tip-icon">
                {iconMap[tip.title]}
              </span>
              {tip.title}
            </h3>
            <p>{tip.content}</p>
            <button
              className="know-more-btn"
              onClick={() => openModal(tip.details)}
            >
              Know More
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalVisible && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-content">
            <span className="close-modal" onClick={closeModal}>
              &times;
            </span>
            <div id="modal-content-area">
              <h4>More Information</h4>
              <p>{modalContent}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default KnowledgeTips;
