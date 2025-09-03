"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  getMostCommonOrders, 
  getSubcategoriesForCategory,
  getOrdersByCategoryAndSubcategory,
  searchOrders,
  formatOrderDisplayName,
  type ImagingOrderData 
} from "@/data/imagingOrders";
import { Search } from "lucide-react";

interface ImagingCategoryViewProps {
  category: string;
  selectedOrders: string[];
  onOrderToggle: (orderId: string, order: ImagingOrderData) => void;
  onOtherOrderAdd: (orderText: string) => void;
}

export default function ImagingCategoryView({
  category,
  selectedOrders,
  onOrderToggle,
  onOtherOrderAdd,
}: ImagingCategoryViewProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [otherOrderText, setOtherOrderText] = React.useState("");

  const mostCommonOrders = getMostCommonOrders(category);
  const subcategories = getSubcategoriesForCategory(category);
  const searchResults = searchQuery.trim() ? searchOrders(searchQuery, category) : [];

  const handleAddOtherOrder = () => {
    if (otherOrderText.trim()) {
      onOtherOrderAdd(otherOrderText.trim());
      setOtherOrderText("");
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="space-y-6">
        {/* Category Header */}
        <div>
          <h1 className="text-2xl font-semibold">{category}</h1>
          <p className="text-fg-muted mt-1">Select imaging studies for this category</p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fg-muted h-4 w-4" />
          <Input
            placeholder="Search studies or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Search Results */}
        {searchQuery.trim() && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Search Results</h2>
            <div className="space-y-2">
              {searchResults.map((order) => (
                <OrderItem
                  key={order.OrderID}
                  order={order}
                  isSelected={selectedOrders.includes(order.OrderID)}
                  onToggle={() => onOrderToggle(order.OrderID, order)}
                />
              ))}
              {searchResults.length === 0 && (
                <p className="text-fg-muted">No matching studies found.</p>
              )}
            </div>
          </div>
        )}

        {/* Most Common Orders (only show when not searching) */}
        {!searchQuery.trim() && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Most Common Studies</h2>
            <div className="space-y-2">
              {mostCommonOrders.map((order) => (
                <OrderItem
                  key={order.OrderID}
                  order={order}
                  isSelected={selectedOrders.includes(order.OrderID)}
                  onToggle={() => onOrderToggle(order.OrderID, order)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Grouped by Subcategory (only show when not searching) */}
        {!searchQuery.trim() && subcategories.map((subcategory) => {
          const subcategoryOrders = getOrdersByCategoryAndSubcategory(category, subcategory);
          return (
            <div key={subcategory} className="space-y-4">
              <h2 className="text-lg font-medium">{subcategory}</h2>
              <div className="space-y-2">
                {subcategoryOrders.map((order) => (
                  <OrderItem
                    key={order.OrderID}
                    order={order}
                    isSelected={selectedOrders.includes(order.OrderID)}
                    onToggle={() => onOrderToggle(order.OrderID, order)}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* Other (Free Text) Option */}
        <div className="space-y-4 border-t border-border pt-6">
          <h2 className="text-lg font-medium">Other (Free Text Order)</h2>
          <div className="flex gap-2">
            <Input
              placeholder="Enter custom imaging order..."
              value={otherOrderText}
              onChange={(e) => setOtherOrderText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddOtherOrder();
                }
              }}
            />
            <Button 
              onClick={handleAddOtherOrder}
              disabled={!otherOrderText.trim()}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface OrderItemProps {
  order: ImagingOrderData;
  isSelected: boolean;
  onToggle: () => void;
}

function OrderItem({ order, isSelected, onToggle }: OrderItemProps) {
  return (
    <div className="flex items-start space-x-3 p-3 border border-border rounded-md hover:bg-surface-muted">
      <Checkbox
        checked={isSelected}
        onCheckedChange={onToggle}
        className="mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-fg">
          {formatOrderDisplayName(order)}
        </div>
        <div className="text-xs text-fg-muted mt-1">
          {order.Modality} • {order.BodyPart}
        </div>
      </div>
    </div>
  );
}
