import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface GoogleSheetsSyncDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function GoogleSheetsSyncDialog({ open, onOpenChange, onSuccess }: GoogleSheetsSyncDialogProps) {
    const [spreadsheetId, setSpreadsheetId] = useState('');
    const [rangeName, setRangeName] = useState('Sheet1!A:Z');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleSync = async () => {
        if (!spreadsheetId) {
            toast.error('Please enter a Spreadsheet ID');
            return;
        }

        setLoading(true);
        setResult(null);
        try {
            const data = await apiFetch('/api/import/google-sheets', {
                method: 'POST',
                body: JSON.stringify({
                    spreadsheet_id: spreadsheetId,
                    range_name: rangeName,
                }),
            });

            setResult(data);
            if (data.successful > 0) {
                toast.success(`Successfully imported ${data.successful} leads`);
                onSuccess?.();
            } else if (data.duplicates > 0) {
                toast.info(`${data.duplicates} duplicate leads skipped`);
            } else {
                toast.error('No leads were imported');
            }
        } catch (error: any) {
            console.error('Sync failed:', error);
            toast.error(error.message || 'Failed to sync with Google Sheets');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (!loading) {
                onOpenChange(val);
                if (!val) setResult(null);
            }
        }}>
            <DialogContent className="sm:max-width-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5 text-green-600" />
                        Sync Google Sheets
                    </DialogTitle>
                    <DialogDescription>
                        Import leads directly from your Google Sheet into the CRM.
                    </DialogDescription>
                </DialogHeader>

                {!result ? (
                    <div className="space-y-4 py-4">
                        <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-700 space-y-2">
                            <p className="font-semibold flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" /> Setup Instructions:
                            </p>
                            <ol className="list-decimal ml-4 space-y-1">
                                <li>Share your sheet with the service account email.</li>
                                <li>Copy the Spreadsheet ID from the URL.</li>
                                <li>Ensure the first row contains headers (Name, Phone, etc.).</li>
                            </ol>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="spreadsheetId">Spreadsheet ID</Label>
                            <Input
                                id="spreadsheetId"
                                placeholder="e.g. 1aBCdEfGhIjKlMnOpQrStUvWxYz..."
                                value={spreadsheetId}
                                onChange={(e) => setSpreadsheetId(e.target.value)}
                            />
                            <p className="text-[10px] text-muted-foreground">
                                Found in the URL: docs.google.com/spreadsheets/d/<b>[ID]</b>/edit
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="range">Sheet Name & Range (Optional)</Label>
                            <Input
                                id="range"
                                placeholder="e.g. Sheet1!A:Z"
                                value={rangeName}
                                onChange={(e) => setRangeName(e.target.value)}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="py-6 space-y-4">
                        <div className="flex flex-col items-center justify-center text-center space-y-2">
                            <CheckCircle2 className="h-12 w-12 text-green-500" />
                            <h3 className="text-lg font-semibold">Import Complete</h3>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <Card className="p-3 text-center">
                                <p className="text-xl font-bold text-green-600">{result.successful}</p>
                                <p className="text-[10px] text-muted-foreground uppercase">Imported</p>
                            </Card>
                            <Card className="p-3 text-center">
                                <p className="text-xl font-bold text-amber-600">{result.duplicates}</p>
                                <p className="text-[10px] text-muted-foreground uppercase">Duplicates</p>
                            </Card>
                            <Card className="p-3 text-center">
                                <p className="text-xl font-bold text-red-600">{result.failed}</p>
                                <p className="text-[10px] text-muted-foreground uppercase">Failed</p>
                            </Card>
                        </div>

                        {result.errors && result.errors.length > 0 && (
                            <div className="max-h-32 overflow-y-auto rounded-md bg-red-50 p-2 text-[10px] text-red-700">
                                <p className="font-bold mb-1">Errors:</p>
                                <ul className="list-disc ml-3">
                                    {result.errors.map((err: string, i: number) => (
                                        <li key={i}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                <DialogFooter>
                    {!result ? (
                        <>
                            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                                Cancel
                            </Button>
                            <Button onClick={handleSync} disabled={loading} className="gap-2 bg-green-600 hover:bg-green-700">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
                                Sync Now
                            </Button>
                        </>
                    ) : (
                        <Button className="w-full" onClick={() => onOpenChange(false)}>
                            Close
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
