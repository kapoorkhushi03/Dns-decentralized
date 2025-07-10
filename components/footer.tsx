import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-white py-6">
      <div className="container mx-auto text-center">
        <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Your Company. All rights reserved.</p>
        <div className="mt-2 flex items-center justify-center space-x-2">
          <p className="text-gray-500 text-xs">Powered by</p>
          <Image src="/placeholder.svg?height=20&width=60" alt="Sui" width={60} height={20} className="h-5" />
          <span className="text-gray-600">•</span>
          <Image src="/placeholder.svg?height=20&width=60" alt="IPFS" width={60} height={20} className="h-5" />
          <span className="text-gray-600">•</span>
          <Image src="/placeholder.svg?height=20&width=60" alt="Pinata" width={60} height={20} className="h-5" />
        </div>
      </div>
    </footer>
  )
}
