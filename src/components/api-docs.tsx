'use client';

import { motion } from 'framer-motion';
import { Copy, Check, Terminal, Key, Shield, Clock, Zap } from 'lucide-react';
import { useState, useCallback } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

function CodeBlock({ code, language = 'json' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <div className="relative group">
      <div className="code-block overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
            </div>
            <span className="text-xs text-gray-500 ml-2 font-mono">{language}</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy
              </>
            )}
          </button>
        </div>
        <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
          <code className="text-gray-300 font-mono">{code}</code>
        </pre>
      </div>
    </div>
  );
}

const quickStartCode = `curl -X POST https://api.pixelforge.ai/v1/tti \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "cinematic futuristic city at sunset",
    "ratio": "16:9",
    "style": "cinematic"
  }'`;

const requestCode = `{
  "prompt": "cinematic futuristic city at sunset, ultra detailed",
  "ratio": "16:9",
  "style": "cinematic",
  "lighting": "golden-hour",
  "camera": "wide-angle",
  "negative_prompt": "blurry, low quality, watermark",
  "seed": 42,
  "num_images": 1
}`;

const responseCode = `{
  "success": true,
  "data": {
    "id": "gen_a1b2c3d4e5f6",
    "prompt": "cinematic futuristic city at sunset, ultra detailed",
    "ratio": "16:9",
    "style": "cinematic",
    "image_url": "https://cdn.pixelforge.ai/images/gen_a1b2c3d4e5f6.png",
    "thumbnail_url": "https://cdn.pixelforge.ai/thumbnails/gen_a1b2c3d4e5f6.png",
    "width": 1344,
    "height": 768,
    "created_at": "2024-01-15T10:30:00Z",
    "generation_time_ms": 3200
  }
}`;

const bulkRequestCode = `{
  "prompts": [
    { "prompt": "cyberpunk cityscape", "ratio": "16:9" },
    { "prompt": "fantasy dragon", "ratio": "1:1" },
    { "prompt": "anime warrior", "ratio": "9:16" }
  ],
  "style": "cinematic",
  "max_concurrent": 5
}`;

const bulkResponseCode = `{
  "success": true,
  "data": {
    "batch_id": "batch_x1y2z3",
    "total": 3,
    "completed": 3,
    "results": [
      {
        "id": "gen_f1e2d3",
        "prompt": "cyberpunk cityscape",
        "image_url": "https://cdn.pixelforge.ai/images/gen_f1e2d3.png",
        "status": "completed"
      },
      ...
    ]
  }
}`;

const rateLimits = [
  { plan: 'Free', limit: '50 images/month', rate: '2 requests/min', concurrent: 1 },
  { plan: 'Pro', limit: '1,000 images/month', rate: '10 requests/min', concurrent: 5 },
  { plan: 'Enterprise', limit: 'Unlimited', rate: '50 requests/min', concurrent: 20 },
];

export default function ApiDocs() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a14]">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/30 via-[#0a0a14] to-pink-950/20 animate-gradient-shift" />
        <div className="absolute top-1/4 right-1/3 w-[350px] h-[350px] rounded-full bg-purple-600/6 blur-[120px] animate-float-slow" />
        <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-pink-600/5 blur-[100px] animate-float" />
      </div>

      <div className="relative px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300 mb-6">
              <Terminal className="h-4 w-4" />
              <span>Developer Resources</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-white">
              API <span className="gradient-text">Documentation</span>
            </h2>
            <p className="mt-4 text-gray-400 text-lg max-w-xl mx-auto">
              Integrate PixelForge AI into your applications with our powerful REST API.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10"
          >
            {/* Quick Start */}
            <motion.div variants={itemVariants}>
              <div className="glass-strong rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Quick Start</h3>
                    <p className="text-sm text-gray-400">Generate your first image in seconds</p>
                  </div>
                </div>
                <CodeBlock code={quickStartCode} language="bash" />
              </div>
            </motion.div>

            {/* Request Format */}
            <motion.div variants={itemVariants}>
              <div className="glass-strong rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                    <Terminal className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Request Format</h3>
                    <p className="text-sm text-gray-400">POST /v1/tti — Single image generation</p>
                  </div>
                </div>
                <CodeBlock code={requestCode} language="json" />
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { field: 'prompt', type: 'string', required: true, desc: 'Text description of the image' },
                    { field: 'ratio', type: 'string', required: false, desc: 'Aspect ratio (1:1, 16:9, etc.)' },
                    { field: 'style', type: 'string', required: false, desc: 'Style preset ID' },
                    { field: 'num_images', type: 'number', required: false, desc: 'Number of images (1-4)' },
                  ].map((param) => (
                    <div key={param.field} className="flex items-start gap-2 rounded-lg bg-black/20 p-3 border border-white/5">
                      <code className="text-purple-400 text-xs font-mono">{param.field}</code>
                      <span className="text-gray-500 text-xs">{param.required ? 'required' : 'optional'}</span>
                      <span className="text-gray-400 text-xs ml-auto">{param.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Response Format */}
            <motion.div variants={itemVariants}>
              <div className="glass-strong rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Response Format</h3>
                    <p className="text-sm text-gray-400">Success response with image URL</p>
                  </div>
                </div>
                <CodeBlock code={responseCode} language="json" />
              </div>
            </motion.div>

            {/* Bulk Generation */}
            <motion.div variants={itemVariants}>
              <div className="glass-strong rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Bulk Generation</h3>
                    <p className="text-sm text-gray-400">POST /v1/tti/bulk — Generate multiple images</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">Request</p>
                    <CodeBlock code={bulkRequestCode} language="json" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">Response</p>
                    <CodeBlock code={bulkResponseCode} language="json" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Rate Limits */}
            <motion.div variants={itemVariants}>
              <div className="glass-strong rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Rate Limits</h3>
                    <p className="text-sm text-gray-400">Fair usage limits per plan</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Plan</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Monthly Limit</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Rate</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Concurrent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rateLimits.map((limit) => (
                        <tr key={limit.plan} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 px-4 text-white font-medium">{limit.plan}</td>
                          <td className="py-3 px-4 text-gray-300">{limit.limit}</td>
                          <td className="py-3 px-4 text-gray-300">{limit.rate}</td>
                          <td className="py-3 px-4 text-gray-300">{limit.concurrent}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>

            {/* Authentication */}
            <motion.div variants={itemVariants}>
              <div className="glass-strong rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Authentication</h3>
                    <p className="text-sm text-gray-400">Secure your API requests</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 rounded-lg bg-black/20 p-4 border border-white/5">
                    <Key className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-white">API Key</h4>
                      <p className="text-sm text-gray-400 mt-1">
                        Include your API key in the <code className="text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded text-xs font-mono">Authorization</code> header as a Bearer token for all requests.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg bg-black/20 p-4 border border-white/5">
                    <Shield className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-white">Security</h4>
                      <p className="text-sm text-gray-400 mt-1">
                        All API requests must be made over HTTPS. Never expose your API key in client-side code. Use environment variables or a secure backend proxy.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg bg-black/20 p-4 border border-white/5">
                    <Clock className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-white">Key Rotation</h4>
                      <p className="text-sm text-gray-400 mt-1">
                        You can rotate your API key at any time from the dashboard. Old keys will remain active for 24 hours after rotation for a smooth transition.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <CodeBlock
                    code={`# Example authenticated request
curl -X POST https://api.pixelforge.ai/v1/tti \\
  -H "Authorization: Bearer pf_sk_abc123..." \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "Hello, PixelForge!"}'`}
                    language="bash"
                  />
                </div>
              </div>
            </motion.div>

            {/* Error Codes */}
            <motion.div variants={itemVariants}>
              <div className="glass-strong rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500">
                    <Terminal className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Error Codes</h3>
                    <p className="text-sm text-gray-400">Standard HTTP status codes</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { code: 200, desc: 'Success — Image generated' },
                    { code: 400, desc: 'Bad Request — Invalid parameters' },
                    { code: 401, desc: 'Unauthorized — Invalid API key' },
                    { code: 429, desc: 'Rate Limited — Too many requests' },
                    { code: 500, desc: 'Server Error — Try again later' },
                    { code: 503, desc: 'Service Unavailable — Maintenance' },
                  ].map((error) => (
                    <div key={error.code} className="flex items-center gap-3 rounded-lg bg-black/20 p-3 border border-white/5">
                      <code className={`text-xs font-mono font-bold ${
                        error.code < 300 ? 'text-green-400' :
                        error.code < 500 ? 'text-yellow-400' : 'text-red-400'
                      }`}>{error.code}</code>
                      <span className="text-sm text-gray-300">{error.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
