<div class="home-container">
  <div class="header-section">
    <h1>Welcome to Cryptology's Playground</h1>
  </div>
  
  <div class="content-grid">
    
    <div class="info-card">
      <h3>About this project</h3>
      <p>
        This web application gives the opportunity to Cryptography enthusiasts to explore and learn
        (in a friendly environment) various concepts about Cryptanalysis and Cryptography in general.
      </p>
      <p>
        You can test various tools used in cryptography and learn their purpose in the world of security and hiding information.
        From simple ciphers to key generation and secure file transfer, you can dive into how cryptography tools operate.
      </p>
      <p>
        Each section is designed to be educational. Each tool will eventually provide information and instructions 
        about how to use the specific tool.
      </p>
      
        Tinker, test, and learn in a sandbox environment with no risk.
        Designed with educational clarity and practical use in mind.
        All tools are modular and instant.
        Explore the left-hand menu to get started:
        <ul>
          <li>Classical & Modern Ciphers</li>
          <li>Hashing & Encoding Algorithms</li>
          <li>Asymmetric & Symmetric Encryption</li>
          <li>File Security Operations</li>
          <li>Entropy Testing & Key Generation</li>
        </ul>
      
      <div class="warning-box">
        <strong>Note:</strong> Do not use sensitive information or real secrets in any of the tools provided.
        You are here to learn and explore. Use the tools carefully and under consideration.
      </div>
    </div>

    <div class="info-card">
      <h3>A few words</h3>
      <p>
        The terms cryptography and cryptanalysis are related but not identical. 
        <b>Cryptology</b> is the broader scientific study of secret communication, 
        which includes both cryptography and cryptanalysis. Both fields rely heavily on mathematics (number theory, algebra, probability).
      </p>
      
      <div class="definition">
        <h4>Cryptography</h4>
        <p>
          The art and science of creating secure communication systems that prevent unauthorized access to information.
          It mainly deals with designing encryption algorithms and protocols to protect data, ensure integrity, and authenticate users/messages.
        </p>
      </div>

      <div class="definition">
        <h4>Cryptanalysis</h4>
        <p>
          The science of analyzing (or breaking) cryptographic systems to find weaknesses. 
          Examples include: bypassing encryption without the key, key recovery, plaintext recovery, identifying flaws,
          and various attacks like brute force or side-channel attacks.
        </p>
      </div>

      <p class="analogy">
        "Cryptography is like building a strong, secure lock, while Cryptanalysis is like being a lockpicker trying to open it without the key."
      </p>
    </div>

  </div>
</div>

<style>
  .home-container { 
    max-width: 1100px; 
    margin: 0 auto; 
    color: #334155; 
    padding-bottom: 2rem;
  }

  .header-section {
    text-align: center;
    margin-bottom: 2rem;
    border-bottom: 2px solid #cbd5e1;
    padding-bottom: 1rem;
  }

  h1 { 
    font-size: 2.2rem; 
    color: #1e293b; 
    margin: 0;
  }

  /* two column layout */
  .content-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: start; /* align cards to the top */
  }

  /* card styling */
  .info-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    border: 1px solid #e2e8f0;
    line-height: 1.6;
    font-size: 0.95rem;
  }

  .info-card h3 {
    color: #2563eb; /* royal blue */
    margin-top: 0;
    margin-bottom: 1.2rem;
    font-size: 1.4rem;
    border-bottom: 2px solid #eff6ff;
    padding-bottom: 0.5rem;
    display: inline-block;
  }

  .info-card p {
    margin-bottom: 1rem;
    text-align: justify;
  }

  /* specific internal styles */
  .warning-box {
    background-color: #fff1f2;
    border-left: 4px solid #f43f5e;
    padding: 1rem;
    margin-top: 1.5rem;
    color: #881337;
    font-size: 0.9rem;
    border-radius: 0 4px 4px 0;
  }

  .definition {
    background-color: #f8fafc;
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
    border: 1px solid #f1f5f9;
  }

  .definition h4 {
    margin: 0 0 0.5rem 0;
    color: #0f172a;
    font-size: 1rem;
  }
  
  .definition p {
    margin: 0;
    font-size: 0.9rem;
    color: #475569;
  }

  .analogy {
    font-style: italic;
    color: #475569;
    background-color: #eff6ff;
    padding: 1rem;
    border-radius: 6px;
    text-align: center !important;
    border: 1px dashed #bfdbfe;
    margin-top: 1.5rem;
    font-weight: 500;
  }

  /* stack columns on small screens */
  @media (max-width: 768px) {
    .content-grid {
      grid-template-columns: 1fr;
    }
  }
</style>