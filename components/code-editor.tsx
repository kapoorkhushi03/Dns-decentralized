"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DomainStorage, type PurchasedDomain } from "@/lib/domain-storage"
import { Code, Eye, Save, RotateCcw, Globe, Clock, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CodeEditorProps {
  domain: PurchasedDomain
  onSave: (code: { html: string; css: string; js: string }) => void
}

export default function CodeEditor({ domain, onSave }: CodeEditorProps) {
  const [htmlCode, setHtmlCode] = useState("")
  const [cssCode, setCssCode] = useState("")
  const [jsCode, setJsCode] = useState("")
  const [activeTab, setActiveTab] = useState("html")
  const [isPreview, setIsPreview] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Load existing code or set default template
    setHtmlCode(domain.htmlCode || getDefaultHTML(domain.name))
    setCssCode(domain.cssCode || getDefaultCSS())
    setJsCode(domain.jsCode || getDefaultJS())
  }, [domain])

  const getDefaultHTML = (domainName: string) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${domainName}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="logo">${domainName}</div>
            <ul class="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section id="home" class="hero">
            <div class="hero-content">
                <h1>Welcome to ${domainName}</h1>
                <p>Your decentralized website powered by blockchain technology</p>
                <button class="cta-button" onclick="scrollToSection('about')">Learn More</button>
            </div>
        </section>

        <section id="about" class="section">
            <div class="container">
                <h2>About Us</h2>
                <p>This is a decentralized website hosted on IPFS and managed through blockchain technology. Your domain is secured as an NFT on the Sui network.</p>
            </div>
        </section>

        <section id="services" class="section">
            <div class="container">
                <h2>Our Services</h2>
                <div class="services-grid">
                    <div class="service-card">
                        <h3>Decentralized Hosting</h3>
                        <p>Your website is distributed across IPFS nodes worldwide</p>
                    </div>
                    <div class="service-card">
                        <h3>Blockchain Security</h3>
                        <p>Domain ownership secured by NFT technology</p>
                    </div>
                    <div class="service-card">
                        <h3>Censorship Resistant</h3>
                        <p>No single point of failure or control</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="contact" class="section">
            <div class="container">
                <h2>Contact</h2>
                <p>Get in touch with us through decentralized channels</p>
                <button class="contact-button">Connect Wallet</button>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${domainName}. Powered by DecentraDNS.</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>`

  const getDefaultCSS = () => `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

.header {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    padding: 1rem 0;
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-links a {
    color: white;
    text-decoration: none;
    transition: opacity 0.3s;
}

.nav-links a:hover {
    opacity: 0.8;
}

.hero {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
}

.hero-content h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    animation: fadeInUp 1s ease-out;
}

.hero-content p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    animation: fadeInUp 1s ease-out 0.2s both;
}

.cta-button {
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid white;
    color: white;
    padding: 1rem 2rem;
    font-size: 1rem;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s;
    animation: fadeInUp 1s ease-out 0.4s both;
}

.cta-button:hover {
    background: white;
    color: #667eea;
    transform: translateY(-2px);
}

.section {
    padding: 5rem 0;
    background: white;
}

.section:nth-child(even) {
    background: #f8f9fa;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.section h2 {
    text-align: center;
    margin-bottom: 3rem;
    font-size: 2.5rem;
    color: #333;
}

.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
}

.service-card {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    text-align: center;
    transition: transform 0.3s;
}

.service-card:hover {
    transform: translateY(-5px);
}

.service-card h3 {
    margin-bottom: 1rem;
    color: #667eea;
}

.contact-button {
    background: #667eea;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.3s;
}

.contact-button:hover {
    background: #5a67d8;
}

.footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 2rem 0;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    .nav {
        flex-direction: column;
        gap: 1rem;
    }
    
    .nav-links {
        gap: 1rem;
    }
    
    .hero-content h1 {
        font-size: 2rem;
    }
    
    .services-grid {
        grid-template-columns: 1fr;
    }
}`

  const getDefaultJS = () => `// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add smooth scrolling to navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    
    // Add scroll effect to header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.color = '#333';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.1)';
            header.style.color = 'white';
        }
    });
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Wallet connection simulation
document.addEventListener('DOMContentLoaded', function() {
    const contactButton = document.querySelector('.contact-button');
    if (contactButton) {
        contactButton.addEventListener('click', function() {
            alert('Wallet connection feature coming soon! This will integrate with Sui wallet.');
        });
    }
});`

  const handleSave = () => {
    const code = { html: htmlCode, css: cssCode, js: jsCode }
    DomainStorage.updateDomainCode(domain.name, code)
    onSave(code)
    setLastSaved(new Date())

    toast({
      title: "Code Saved",
      description: "Your website code has been saved successfully",
    })
  }

  const handleReset = () => {
    setHtmlCode(getDefaultHTML(domain.name))
    setCssCode(getDefaultCSS())
    setJsCode(getDefaultJS())

    toast({
      title: "Code Reset",
      description: "Code has been reset to default template",
    })
  }

  const generatePreview = () => {
    const fullHTML = htmlCode
      .replace('<link rel="stylesheet" href="styles.css">', `<style>${cssCode}</style>`)
      .replace('<script src="script.js"></script>', `<script>${jsCode}</script>`)

    return fullHTML
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Code className="h-6 w-6 text-purple-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Code Editor</h2>
            <p className="text-gray-400">Edit your website code for {domain.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-green-600 text-white">
            <Globe className="h-3 w-3 mr-1" />
            {domain.status}
          </Badge>
          {lastSaved && (
            <div className="text-xs text-gray-400 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Saved {lastSaved.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button
            onClick={() => setIsPreview(!isPreview)}
            variant="outline"
            className="border-gray-600 text-gray-300 bg-transparent"
          >
            {isPreview ? <Code className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
            {isPreview ? "Edit Code" : "Preview"}
          </Button>
          <Button onClick={handleReset} variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset to Template
          </Button>
        </div>
        <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
          <Save className="h-4 w-4 mr-1" />
          Save Changes
        </Button>
      </div>

      {/* Editor/Preview */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-0">
          {isPreview ? (
            <div className="h-96 w-full">
              <iframe
                srcDoc={generatePreview()}
                className="w-full h-full border-0 rounded-lg"
                title="Website Preview"
                sandbox="allow-scripts"
              />
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-700 rounded-none">
                <TabsTrigger value="html" className="data-[state=active]:bg-gray-600">
                  HTML
                </TabsTrigger>
                <TabsTrigger value="css" className="data-[state=active]:bg-gray-600">
                  CSS
                </TabsTrigger>
                <TabsTrigger value="js" className="data-[state=active]:bg-gray-600">
                  JavaScript
                </TabsTrigger>
              </TabsList>

              <TabsContent value="html" className="m-0">
                <textarea
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  className="w-full h-96 p-4 bg-gray-900 text-gray-100 font-mono text-sm border-0 resize-none focus:outline-none"
                  placeholder="Enter your HTML code here..."
                />
              </TabsContent>

              <TabsContent value="css" className="m-0">
                <textarea
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  className="w-full h-96 p-4 bg-gray-900 text-gray-100 font-mono text-sm border-0 resize-none focus:outline-none"
                  placeholder="Enter your CSS code here..."
                />
              </TabsContent>

              <TabsContent value="js" className="m-0">
                <textarea
                  value={jsCode}
                  onChange={(e) => setJsCode(e.target.value)}
                  className="w-full h-96 p-4 bg-gray-900 text-gray-100 font-mono text-sm border-0 resize-none focus:outline-none"
                  placeholder="Enter your JavaScript code here..."
                />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Domain:</span>
              <span className="text-white ml-2">{domain.name}</span>
            </div>
            <div>
              <span className="text-gray-400">IPFS Hash:</span>
              <span className="text-white ml-2 font-mono">{domain.ipfsHash.slice(0, 12)}...</span>
            </div>
            <div>
              <span className="text-gray-400">Status:</span>
              <Badge className="ml-2 bg-green-600 text-white text-xs">{domain.status}</Badge>
            </div>
            <div>
              <span className="text-gray-400">Published:</span>
              <Badge className={`ml-2 text-xs ${domain.isPublished ? "bg-green-600" : "bg-gray-600"} text-white`}>
                {domain.isPublished ? "Live" : "Draft"}
              </Badge>
            </div>
          </div>

          <div className="flex space-x-2 pt-2">
            <Button
              size="sm"
              onClick={() => DomainStorage.publishDomain(domain.name, !domain.isPublished)}
              className={domain.isPublished ? "bg-gray-600 hover:bg-gray-700" : "bg-green-600 hover:bg-green-700"}
            >
              {domain.isPublished ? "Unpublish" : "Publish"} Website
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-gray-600 text-gray-300 bg-transparent"
              onClick={() => window.open(`https://ipfs.io/ipfs/${domain.ipfsHash}`, "_blank")}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View Live
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
