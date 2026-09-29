import Foundation
import WebKit
import Cocoa

let app = NSApplication.shared
app.setActivationPolicy(.prohibited)

struct AuditTarget {
    let name: String
    let width: CGFloat
    let height: CGFloat
    let elementId: String?
    let scrollY: CGFloat?
}

let targets: [AuditTarget] = [
    // Laptop viewports (1440 x 900)
    AuditTarget(name: "laptop_01_hero", width: 1440, height: 900, elementId: nil, scrollY: 0),
    AuditTarget(name: "laptop_02_hero_scrolled", width: 1440, height: 900, elementId: nil, scrollY: 280),
    AuditTarget(name: "laptop_03_method", width: 1440, height: 900, elementId: "method", scrollY: nil),
    AuditTarget(name: "laptop_04_studio", width: 1440, height: 900, elementId: "studio", scrollY: nil),
    AuditTarget(name: "laptop_05_atelier", width: 1440, height: 900, elementId: "atelier", scrollY: nil),
    AuditTarget(name: "laptop_06_codes", width: 1440, height: 900, elementId: "house-codes", scrollY: nil),
    AuditTarget(name: "laptop_07_chapters", width: 1440, height: 900, elementId: "chapters", scrollY: nil),
    AuditTarget(name: "laptop_08_leadership", width: 1440, height: 900, elementId: "leadership", scrollY: nil),
    AuditTarget(name: "laptop_09_stories", width: 1440, height: 900, elementId: "lookbook", scrollY: nil),
    AuditTarget(name: "laptop_10_expansion", width: 1440, height: 900, elementId: "destinations", scrollY: nil),
    AuditTarget(name: "laptop_11_legacy", width: 1440, height: 900, elementId: "legacy", scrollY: nil),
    AuditTarget(name: "laptop_12_gallery", width: 1440, height: 900, elementId: "gallery", scrollY: nil),
    AuditTarget(name: "laptop_13_booking", width: 1440, height: 900, elementId: "booking", scrollY: nil),
    
    // Mobile viewports (iPhone 15 / 16 size 393 x 852)
    AuditTarget(name: "mobile_01_hero", width: 393, height: 852, elementId: nil, scrollY: 0),
    AuditTarget(name: "mobile_02_hero_scrolled", width: 393, height: 852, elementId: nil, scrollY: 250),
    AuditTarget(name: "mobile_03_method", width: 393, height: 852, elementId: "method", scrollY: nil),
    AuditTarget(name: "mobile_04_studio", width: 393, height: 852, elementId: "studio", scrollY: nil),
    AuditTarget(name: "mobile_05_atelier", width: 393, height: 852, elementId: "atelier", scrollY: nil),
    AuditTarget(name: "mobile_06_codes", width: 393, height: 852, elementId: "house-codes", scrollY: nil),
    AuditTarget(name: "mobile_07_chapters", width: 393, height: 852, elementId: "chapters", scrollY: nil),
    AuditTarget(name: "mobile_08_leadership", width: 393, height: 852, elementId: "leadership", scrollY: nil),
    AuditTarget(name: "mobile_09_stories", width: 393, height: 852, elementId: "lookbook", scrollY: nil),
    AuditTarget(name: "mobile_10_expansion", width: 393, height: 852, elementId: "destinations", scrollY: nil),
    AuditTarget(name: "mobile_11_legacy", width: 393, height: 852, elementId: "legacy", scrollY: nil),
    AuditTarget(name: "mobile_12_gallery", width: 393, height: 852, elementId: "gallery", scrollY: nil),
    AuditTarget(name: "mobile_13_booking", width: 393, height: 852, elementId: "booking", scrollY: nil)
]

class Auditor: NSObject, WKNavigationDelegate {
    var currentIndex = 0
    var webView: WKWebView?
    var auditLogs: [String] = []
    
    func runNext() {
        if currentIndex >= targets.count {
            print("\n=== AUDIT COMPLETE ===")
            for log in auditLogs {
                print(log)
            }
            exit(0)
        }
        
        let t = targets[currentIndex]
        let targetDesc = t.elementId != nil ? "#\(t.elementId!)" : "sy=\(Int(t.scrollY ?? 0))"
        print("Auditing [\(currentIndex+1)/\(targets.count)]: \(t.name) (size \(Int(t.width))x\(Int(t.height)), target: \(targetDesc))")
        
        let config = WKWebViewConfiguration()
        let frame = NSRect(x: 0, y: 0, width: t.width, height: t.height)
        let wv = WKWebView(frame: frame, configuration: config)
        wv.navigationDelegate = self
        self.webView = wv
        
        let url = URL(string: "http://localhost:5180/?phase=complete")!
        wv.load(URLRequest(url: url))
    }
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        let t = targets[self.currentIndex]
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) {
            let elIdStr = t.elementId ?? ""
            let scrollYVal = t.scrollY ?? 0
            let scrollScript = """
            (function() {
                var targetSy = \(scrollYVal);
                var elId = "\(elIdStr)";
                if (elId) {
                    var el = document.getElementById(elId);
                    if (el) {
                        var r = el.getBoundingClientRect();
                        targetSy = window.scrollY + r.top - 50;
                    }
                }
                try {
                    window.scrollTo({ top: targetSy, left: 0, behavior: 'instant' });
                } catch(e) {
                    window.scrollTo(0, targetSy);
                }
                window.dispatchEvent(new Event('scroll'));
                return {
                    scrollWidth: document.documentElement.scrollWidth,
                    clientWidth: document.documentElement.clientWidth,
                    overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
                    scrollY: window.scrollY,
                    scrollHeight: document.documentElement.scrollHeight
                };
            })()
            """
            webView.evaluateJavaScript(scrollScript) { res, err in
                if let dict = res as? [String: Any] {
                    let hasOverflowX = (dict["overflowX"] as? Bool) ?? false
                    let sw = dict["scrollWidth"] as? Int ?? 0
                    let cw = dict["clientWidth"] as? Int ?? 0
                    let sy = dict["scrollY"] as? Double ?? 0.0
                    let status = hasOverflowX ? "⚠️ HORIZONTAL OVERFLOW DETECTED: scrollWidth=\(sw), clientWidth=\(cw)" : "✓ OK (no horizontal overflow)"
                    self.auditLogs.append("[\(t.name)] sy=\(Int(sy)) | \(status)")
                }
                
                // Settle LERP loop
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) {
                    let snapConfig = WKSnapshotConfiguration()
                    webView.takeSnapshot(with: snapConfig) { img, err in
                        if let image = img, let tiff = image.tiffRepresentation, let rep = NSBitmapImageRep(data: tiff), let png = rep.representation(using: .png, properties: [:]) {
                            let outPath = "/Users/harshitgoyal/marvelous/public/assets/audit_\(t.name).png"
                            try? png.write(to: URL(fileURLWithPath: outPath))
                        }
                        self.currentIndex += 1
                        self.runNext()
                    }
                }
            }
        }
    }
}

let auditor = Auditor()
auditor.runNext()
app.run()
