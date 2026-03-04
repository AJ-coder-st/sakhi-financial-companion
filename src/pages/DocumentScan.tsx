import { useState } from "react";
import { UploadCloud, FileText, IndianRupee, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ScanResponse {
  success?: boolean;
  detectedText?: string;
  amount?: number | null;
  bank?: string | null;
  date?: string | null;
  referenceNumber?: string | null;
  purpose?: string | null;
  error?: string;
}

const DocumentScan = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setResult(null);
    setError(null);

    if (!f) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    if (!["image/png", "image/jpeg", "image/jpg"].includes(f.type)) {
      setError("Please upload a PNG or JPEG image of a financial document.");
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    if (f.size > 5 * 1024 * 1024) {
      setError("File is too large. Please upload an image smaller than 5 MB.");
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!file) {
      setError("Please select an image to scan.");
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/scanDocument", {
        method: "POST",
        body: formData,
      });

      const data = (await res.json().catch(() => ({}))) as ScanResponse;

      if (!res.ok) {
        setError(
          data.error ||
            "We could not scan this document. Please try again with a clearer image.",
        );
        return;
      }

      setResult(data);
    } catch (err) {
      console.error("Scan failed", err);
      setError(
        "Something went wrong while scanning the document. Please check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-24 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Smart Financial Document Scanner
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Upload bank challans, demand drafts, receipts or payment slips. SAKHI will
            read the document, extract key details like amount and reference number, and
            structure them for your financial twin.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <Card>
            <CardHeader>
              <CardTitle>Upload document</CardTitle>
              <CardDescription>
                Supported formats: PNG, JPG, JPEG. Max size: 5 MB.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file">Financial document image</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="file"
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                {previewUrl && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-1">
                      Preview (for your reference)
                    </p>
                    <div className="relative w-full max-h-64 overflow-hidden rounded-md border bg-muted flex items-center justify-center">
                      <img
                        src={previewUrl}
                        alt="Document preview"
                        className="max-h-64 object-contain"
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2">
                    {error}
                  </p>
                )}

                <Button type="submit" className="w-full" disabled={!file || isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Scanning document...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4 mr-2" />
                      Scan & Extract Details
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI extracted information</CardTitle>
              <CardDescription>
                View raw OCR text and key financial fields detected by SAKHI.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Detected text</Label>
                <Textarea
                  value={result?.detectedText || ""}
                  readOnly
                  placeholder="Upload a document to see the detected text here..."
                  className="min-h-[120px] text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border rounded-md px-3 py-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <IndianRupee className="w-3 h-3" />
                    <span>Amount</span>
                  </div>
                  <p className="text-sm font-medium">
                    {result?.amount != null ? `₹${result.amount}` : "—"}
                  </p>
                </div>
                <div className="border rounded-md px-3 py-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <FileText className="w-3 h-3" />
                    <span>Bank</span>
                  </div>
                  <p className="text-sm font-medium">{result?.bank || "—"}</p>
                </div>
                <div className="border rounded-md px-3 py-2">
                  <p className="text-xs text-muted-foreground mb-1">Date</p>
                  <p className="text-sm font-medium">{result?.date || "—"}</p>
                </div>
                <div className="border rounded-md px-3 py-2">
                  <p className="text-xs text-muted-foreground mb-1">Reference number</p>
                  <p className="text-xs font-mono break-all">
                    {result?.referenceNumber || "—"}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <Label>Purpose</Label>
                <p className="text-sm min-h-[1.5rem]">
                  {result?.purpose || "—"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentScan;

