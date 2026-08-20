import { 
  GlassWater, 
  Home, 
  Sprout, 
  Waves, 
  Fish, 
  Check 
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { WaterUseCategory } from "../../data/mockData";

interface WaterUseCardProps {
  useOption: WaterUseCategory;
  isSelected: boolean;
  onSelect: (id: WaterUseCategory["id"]) => void;
}

const iconMap: Record<string, LucideIcon> = {
  GlassWater: GlassWater,
  Home: Home,
  Sprout: Sprout,
  Waves: Waves,
  Fish: Fish,
};

export default function WaterUseCard({ useOption, isSelected, onSelect }: WaterUseCardProps) {
  const IconComponent = iconMap[useOption.icon] || Waves;

  return (
    <button
      type="button"
      onClick={() => onSelect(useOption.id)}
      className={`group relative flex w-full flex-col text-left rounded-2xl p-5 border transition-all duration-200 cursor-pointer ${
        isSelected
          ? "border-cyan-600 bg-cyan-50/40 shadow-md ring-2 ring-cyan-600/30"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
      }`}
    >
      <div className="flex w-full items-start justify-between">
        <div className={`rounded-xl p-3 transition-colors ${
          isSelected ? "bg-cyan-600 text-white" : "bg-slate-100 text-slate-700 group-hover:bg-slate-200"
        }`}>
          <IconComponent className="h-6 w-6" />
        </div>

        <div className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all ${
          isSelected
            ? "border-cyan-600 bg-cyan-600 text-white"
            : "border-slate-300 bg-white text-transparent"
        }`}>
          <Check className="h-3.5 w-3.5 stroke-[3]" />
        </div>
      </div>

      <div className="mt-4">
        <h3 className={`text-base font-bold tracking-tight ${
          isSelected ? "text-cyan-950" : "text-slate-900"
        }`}>
          {useOption.title}
        </h3>
        <p className="mt-1 text-xs text-slate-500 leading-relaxed">
          {useOption.shortDescription}
        </p>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3 text-[11px] font-medium text-slate-400">
        <span className="font-semibold text-slate-500">Criteria:</span> {useOption.safetyThresholds}
      </div>
    </button>
  );
}
