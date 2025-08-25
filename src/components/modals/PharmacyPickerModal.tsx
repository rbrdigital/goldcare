"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function PharmacyPickerModal({
  onClose,
  onSelect
}: {
  onClose: () => void;
  onSelect: (name: string) => void;
}) {
  const [q, setQ] = React.useState({ name: "", address: "", city: "", state: "", zip: "" });

  const mock = [
    { name: "CVS Pharmacy #1023", address: "123 Main St, Naples, FL 34102" },
    { name: "Walgreens #5541", address: "200 Pine Ave, Naples, FL 34103" },
    { name: "Publix Pharmacy", address: "901 Lake Dr, Naples, FL 34104" }
  ];

  const results = mock.filter(
    (r) =>
      [q.name, q.address, q.city, q.state, q.zip]
        .map((s) => s.trim().toLowerCase())
        .every((s) => (s ? (r.name + " " + r.address).toLowerCase().includes(s) : true))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-xl border border-border bg-bg p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Choose pharmacy</h3>
          <button onClick={onClose} className="text-sm underline">Close</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="md:col-span-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Pharmacy name" value={q.name} onChange={(e) => setQ({ ...q, name: e.target.value })} />
          </div>
          <div className="md:col-span-3">
            <Label htmlFor="addr">Address</Label>
            <Input id="addr" placeholder="Street address" value={q.address} onChange={(e) => setQ({ ...q, address: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" placeholder="City" value={q.city} onChange={(e) => setQ({ ...q, city: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input id="state" placeholder="FL" value={q.state} onChange={(e) => setQ({ ...q, state: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="zip">ZIP</Label>
            <Input id="zip" placeholder="34102" value={q.zip} onChange={(e) => setQ({ ...q, zip: e.target.value })} />
          </div>
        </div>

        <Separator className="my-4" />

        <div className="max-h-64 overflow-auto space-y-2">
          {results.map((r) => (
            <button
              key={r.name}
              onClick={() => onSelect(r.name)}
              className="w-full text-left rounded-lg border border-border p-3 hover:bg-surface"
            >
              <div className="font-medium">{r.name}</div>
              <div className="text-sm text-fg-muted">{r.address}</div>
            </button>
          ))}
          {results.length === 0 ? <div className="text-sm text-fg-muted">No matches.</div> : null}
        </div>

        <div className="mt-4 flex justify-end">
          <Button className="bg-primary text-on-primary">Select</Button>
        </div>
      </div>
    </div>
  );
}