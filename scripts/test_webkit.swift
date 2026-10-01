import Foundation
import WebKit
import Cocoa

let app = NSApplication.shared
app.setActivationPolicy(.prohibited)

class WebDelegate: NSObject, WKNavigationDelegate, WKScriptMessageHandler {
    let width: CGFloat
    let height: CGFloat
    let outputPath: String
    let scrollTargetY: CGFloat
    var webView: WKWebView?
    
    init(width: CGFloat, height: CGFloat, scrollTargetY: CGFloat, outputPath: String) {
        self.width = width
        self.height = height
        self.scrollTargetY = scrollTargetY
        self.outputPath = outputPath
    }
    
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        print("[JS LOG] \(message.name): \(message.body)")
    }
    
    func start() {
        let config = WKWebViewConfiguration()
        let ucc = WKUserContentController()
        ucc.add(self, name: "consoleLog")
        ucc.add(self, name: "jsError")
        
        let js = """
        window.addEventListener('error', (e) => {
            window.webkit.messageHandlers.jsError.postMessage(e.message + ' at ' + e.filename + ':' + e.lineno);
        });
        const origLog = console.log;
        console.log = (...args) => {
            window.webkit.messageHandlers.consoleLog.postMessage(args.map(String).join(' '));
            origLog.apply(console, args);
        };
        const origErr = console.error;
        console.error = (...args) => {
            window.webkit.messageHandlers.jsError.postMessage(args.map(String).join(' '));
            origErr.apply(console, args);
        };
        """
        let userScript = WKUserScript(source: js, injectionTime: .atDocumentStart, forMainFrameOnly: false)
        ucc.addUserScript(userScript)
        config.userContentController = ucc
        
        let frame = NSRect(x: 0, y: 0, width: width, height: height)
        let wv = WKWebView(frame: frame, configuration: config)
        wv.navigationDelegate = self
        self.webView = wv
        
        let targetUrlStr = CommandLine.arguments.count > 5 ? CommandLine.arguments[5] : "http://localhost:5173/?phase=complete#gallery"
        let url = URL(string: targetUrlStr)!
        wv.load(URLRequest(url: url))
    }
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            webView.evaluateJavaScript("document.getElementById('root')?.innerHTML.length") { res, err in
                print("Root innerHTML length: \(String(describing: res))")
            }
            webView.evaluateJavaScript("document.querySelector('.hero')?.className") { res, err in
                print("Hero className: \(String(describing: res))")
            }
            webView.evaluateJavaScript("window.scrollY") { res, err in
                print("window.scrollY: \(String(describing: res))")
            }
            if self.scrollTargetY > 0 {
                let js = "window.scrollTo(0, \(self.scrollTargetY)); window.dispatchEvent(new Event('scroll'));"
                webView.evaluateJavaScript(js) { _, _ in
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) {
                        self.capture()
                    }
                }
            } else {
                self.capture()
            }
        }
    }
    
    func capture() {
        guard let wv = self.webView else { exit(1) }
        let snapConfig = WKSnapshotConfiguration()
        wv.takeSnapshot(with: snapConfig) { image, error in
            if let img = image, let tiff = img.tiffRepresentation, let rep = NSBitmapImageRep(data: tiff), let png = rep.representation(using: .png, properties: [:]) {
                try? png.write(to: URL(fileURLWithPath: self.outputPath))
                print("Captured \(self.outputPath)")
                exit(0)
            } else {
                print("Snapshot error: \(String(describing: error))")
                exit(1)
            }
        }
    }
}

let args = CommandLine.arguments
let w: CGFloat = args.count > 1 ? CGFloat(Double(args[1]) ?? 1440) : 1440
let h: CGFloat = args.count > 2 ? CGFloat(Double(args[2]) ?? 900) : 900
let sy: CGFloat = args.count > 3 ? CGFloat(Double(args[3]) ?? 0) : 0
let out: String = args.count > 4 ? args[4] : "screenshot.png"

let delegate = WebDelegate(width: w, height: h, scrollTargetY: sy, outputPath: out)
delegate.start()
app.run()
