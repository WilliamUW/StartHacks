"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function PortfolioGlobe() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!containerRef.current) return

    // Set up scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xffffff)

    // Set up camera
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)
    camera.position.z = 5

    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)

    // Get container dimensions
    const container = containerRef.current
    const { width, height } = container.getBoundingClientRect()
    renderer.setSize(width, height)
    container.appendChild(renderer.domElement)

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.1 // Changed from 0.05 (higher value = faster damping)
    controls.rotateSpeed = 1.0 // Changed from 0.5 (higher value = faster rotation)
    controls.enableZoom = true
    controls.minDistance = 3
    controls.maxDistance = 10
    controls.autoRotate = true
    controls.autoRotateSpeed = 1.0 // Changed from 0.5 (higher value = faster auto-rotation)

    // Create globe
    const globeGeometry = new THREE.SphereGeometry(2, 64, 64)

    // Load earth texture
    const textureLoader = new THREE.TextureLoader()
    const earthTexture = textureLoader.load("/earth-texture.jpg", () => {
      setIsLoading(false)
    })

    const globeMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      transparent: true,
      opacity: 0.9,
    })

    const globe = new THREE.Mesh(globeGeometry, globeMaterial)
    scene.add(globe)

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 3, 5)
    scene.add(directionalLight)

    // Portfolio exposure data
    const exposureData = [
      { region: "North America", lat: 40, lon: -100, percentage: 55, color: 0x3b82f6 },
      { region: "Europe", lat: 50, lon: 10, percentage: 20, color: 0x64748b },
      { region: "Asia Pacific", lat: 30, lon: 120, percentage: 15, color: 0x10b981 },
      { region: "Emerging Markets - Asia", lat: 20, lon: 80, percentage: 8, color: 0xf59e0b },
      { region: "Other", lat: -10, lon: -60, percentage: 2, color: 0x8b5cf6 },
    ]

    // Add markers for portfolio exposure
    exposureData.forEach((region) => {
      // Convert lat/lon to 3D coordinates
      const phi = (90 - region.lat) * (Math.PI / 180)
      const theta = (region.lon + 180) * (Math.PI / 180)

      const x = -2 * Math.sin(phi) * Math.cos(theta)
      const y = 2 * Math.cos(phi)
      const z = 2 * Math.sin(phi) * Math.sin(theta)

      // Create marker
      const markerSize = 0.05 + (region.percentage / 100) * 0.2
      const markerGeometry = new THREE.SphereGeometry(markerSize, 16, 16)
      const markerMaterial = new THREE.MeshBasicMaterial({ color: region.color })
      const marker = new THREE.Mesh(markerGeometry, markerMaterial)

      marker.position.set(x, y, z)
      scene.add(marker)

      // Add glow effect
      const glowGeometry = new THREE.SphereGeometry(markerSize * 1.2, 16, 16)
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: region.color,
        transparent: true,
        opacity: 0.3,
      })
      const glow = new THREE.Mesh(glowGeometry, glowMaterial)
      glow.position.set(x, y, z)
      scene.add(glow)
    })

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return

      const { width, height } = containerRef.current.getBoundingClientRect()
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    window.addEventListener("resize", handleResize)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement)
      }
      window.removeEventListener("resize", handleResize)
      controls.dispose()
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  )
}

