import Foundation
import WebKit
import Cocoa

let app = NSApplication.shared
app.setActivationPolicy(.prohibited)

class AuditDelegate: NSObject, WKNavigationDelegate {
    let width: CGFloat
    let height: CGFloat
    let deviceName: String
    var webView: WKWebView?
    
    init(width: CGFloat, height: CGFloat, deviceName: String) {
        self.width = width
        self.height = height
        self.deviceName = deviceName
    }
    
    func start() {
        let config = WKWebViewConfiguration()
        let frame = NSRect(x: 0, y: 0, width: width, height: height)
        let wv = WKWebView(frame: frame, configuration: config)
        wv.navigationDelegate = self
        self.webView = wv
        
        let url = URL(string: "http://localhost:5173/?phase=complete")!
        wv.load(URLRequest(url: url))
    }
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            let auditScript = """
            (() => {
                const results = {
                    windowWidth: window.innerWidth,
                    docScrollWidth: document.documentElement.scrollWidth,
                    bodyScrollWidth: document.body.scrollWidth,
                    hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth || document.body.scrollWidth > window.innerWidth,
                    overflowingElements: [],
                    sections: []
                };

                const allElements = document.querySelectorAll('*');
                allElements.forEach(el => {
                    const rect = el.getBoundingClientRect();
                    if (rect.right > window.innerWidth + 1) {
                        const tag = el.tagName.toLowerCase();
                        const cls = el.className ? (typeof el.className === 'string' ? el.className : '') : '';
                        const id = el.id ? '#' + el.id : '';
                        results.overflowingElements.push({
                            selector: tag + id + (cls ? '.' + cls.split(' ').slice(0, 2).join('.') : ''),
                            rectRight: rect.right,
                            windowWidth: window.innerWidth,
                            overflowAmount: rect.right - window.innerWidth
                        });
                    }
                });

                const sections = document.querySelectorAll('section, header, footer, .method-section, .editorial-section, .franchise-section, .partners-section, .leadership-section, .booking-section, .expansion-section, .story-section, .art-gallery-section');
                sections.forEach(s => {
                    const rect = s.getBoundingClientRect();
                    const comp = window.getComputedStyle(s);
                    results.sections.push({
                        id: s.id || s.className,
                        height: rect.height,
                        paddingTop: comp.paddingTop,
                        paddingBottom: comp.paddingBottom,
                        paddingLeft: comp.paddingLeft,
                        paddingRight: comp.paddingRight,
                        marginTop: comp.marginTop,
                        marginBottom: comp.marginBottom
                    });
                });

                return JSON.stringify(results, null, 2);
            })()
            """
            
            webView.evaluateJavaScript(auditScript) { res, err in
                if let jsonStr = res as? String {
                    print("=== AUDIT SUMMARY FOR \(self.deviceName) (\(self.width)x\(self.height)) ===")
                    if let data = jsonStr.data(using: .utf8),
                       let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] {
                        print("Window Width: \(json["windowWidth"] ?? "")")
                        print("Doc Scroll Width: \(json["docScrollWidth"] ?? "")")
                        print("Body Scroll Width: \(json["bodyScrollWidth"] ?? "")")
                        print("Has Overflow: \(json["hasHorizontalOverflow"] ?? "")")
                        if let overflows = json["overflowingElements"] as? [[String: Any]] {
                            print("Overflowing Elements Count: \(overflows.count)")
                            for of in overflows {
                                print(" - \(of["selector"] ?? ""): right=\(of["rectRight"] ?? "") (overflow: \(of["overflowAmount"] ?? ""))")
                            }
                        }
                    }
                } else if let err = err {
                    print("Error during audit: \(err)")
                }
                exit(0)
            }
        }
    }
}

let args = CommandLine.arguments
let w: CGFloat = args.count > 1 ? CGFloat(Double(args[1]) ?? 390) : 390
let h: CGFloat = args.count > 2 ? CGFloat(Double(args[2]) ?? 844) : 844
let name: String = args.count > 3 ? args[3] : "Mobile"

let delegate = AuditDelegate(width: w, height: h, deviceName: name)
delegate.start()
app.run()
