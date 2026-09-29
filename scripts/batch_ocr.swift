import Foundation
import Vision
import AppKit

let folderPath = "/Users/harshitgoyal/.gemini/antigravity-ide/brain/f4dc23fc-cdbb-4248-aa36-54bd427285b3/.user_uploaded"
let outputPath = "/Users/harshitgoyal/marvelous/public/assets/gallery/ocr_analysis.json"

let fileManager = FileManager.default
guard let files = try? fileManager.contentsOfDirectory(atPath: folderPath) else {
    print("Could not read directory")
    exit(1)
}

let jpgFiles = files.filter { $0.hasSuffix(".jpg") }.sorted()
print("Found \(jpgFiles.count) images to process with Vision OCR...")

var results: [[String: Any]] = []

for (idx, fileName) in jpgFiles.enumerated() {
    let filePath = "\(folderPath)/\(fileName)"
    let imageURL = URL(fileURLWithPath: filePath)
    
    guard let nsImage = NSImage(contentsOf: imageURL),
          let tiffData = nsImage.tiffRepresentation,
          let bitmap = NSBitmapImageRep(data: tiffData),
          let cgImage = bitmap.cgImage else {
        print("[\(idx+1)] Skipped: \(fileName) (cannot load CGImage)")
        continue
    }
    
    let semaphore = DispatchSemaphore(value: 0)
    var recognizedLines: [String] = []
    
    let request = VNRecognizeTextRequest { (req, err) in
        defer { semaphore.signal() }
        if let err = err {
            print("Error: \(err)")
            return
        }
        guard let observations = req.results as? [VNRecognizedTextObservation] else { return }
        for obs in observations {
            if let top = obs.topCandidates(1).first {
                recognizedLines.append(top.string)
            }
        }
    }
    request.recognitionLevel = .accurate
    request.usesLanguageCorrection = true
    
    let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
    do {
        try handler.perform([request])
        semaphore.wait()
    } catch {
        print("Handler error on \(fileName): \(error)")
        continue
    }
    
    results.append([
        "index": idx + 1,
        "file": fileName,
        "lines": recognizedLines,
        "text": recognizedLines.joined(separator: " ")
    ])
    print("[\(idx+1)/\(jpgFiles.count)] \(fileName): \(recognizedLines.count) text lines extracted")
}

if let jsonData = try? JSONSerialization.data(withJSONObject: results, options: .prettyPrinted) {
    try? jsonData.write(to: URL(fileURLWithPath: outputPath))
    print("Successfully wrote OCR results to \(outputPath)")
}
