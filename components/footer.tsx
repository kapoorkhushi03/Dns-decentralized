import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-white py-6">
      <div className="container mx-auto text-center">
        <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Your Company. All rights reserved.</p>
       
      </div>
    </footer>
  )
}
