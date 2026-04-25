"use client";

import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import Button from "@/components/common/Button";

export interface StepConfig {
  id: string;
  label: string;
  description?: string;
  render: (value: unknown, onChange: (val: unknown) => void) => ReactNode;
}

export interface StepFormProps {
  steps: StepConfig[];
  onComplete: (data: Record<string, unknown>) => void;
  initialStep?: number;
  initialData?: Record<string, unknown>;
  autoSaveKey?: string;
}

interface SavedState {
  currentStep: number;
  data: Record<string, unknown>;
  savedAt: number;
}

export default function StepForm({
  steps,
  onComplete,
  initialStep = 0,
  initialData = {},
  autoSaveKey,
}: StepFormProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [data, setData] = useState<Record<string, unknown>>(initialData);
  const dataRef = useRef(data);
  const stepRef = useRef(currentStep);

  // Keep refs in sync
  dataRef.current = data;
  stepRef.current = currentStep;

  // Resume from localStorage on mount
  useEffect(() => {
    if (!autoSaveKey) return;
    try {
      const raw = localStorage.getItem(autoSaveKey);
      if (raw) {
        const saved: SavedState = JSON.parse(raw);
        setData((prev) => ({ ...prev, ...saved.data }));
        setCurrentStep(saved.currentStep);
      }
    } catch {
      // ignore corrupt data
    }
  }, [autoSaveKey]);

  // Auto-save every 30 seconds
  const saveToStorage = useCallback(() => {
    if (!autoSaveKey) return;
    try {
      const state: SavedState = {
        currentStep: stepRef.current,
        data: dataRef.current,
        savedAt: Date.now(),
      };
      localStorage.setItem(autoSaveKey, JSON.stringify(state));
    } catch {
      // storage full or unavailable
    }
  }, [autoSaveKey]);

  useEffect(() => {
    if (!autoSaveKey) return;
    const interval = setInterval(saveToStorage, 30_000);
    return () => clearInterval(interval);
  }, [autoSaveKey, saveToStorage]);

  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  function handleChange(val: unknown) {
    setData((prev) => ({ ...prev, [step.id]: val }));
  }

  function handleNext() {
    if (isLast) {
      // Save final state and complete
      saveToStorage();
      onComplete(data);
    } else {
      setCurrentStep((s) => s + 1);
    }
  }

  function handleBack() {
    if (!isFirst) setCurrentStep((s) => s - 1);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-label-sm text-on-surface-variant mb-2">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-container rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
            role="progressbar"
            aria-valuenow={currentStep + 1}
            aria-valuemin={1}
            aria-valuemax={steps.length}
            aria-label={`Step ${currentStep + 1} of ${steps.length}`}
          />
        </div>
      </div>

      {/* Step header */}
      <div>
        <h2 className="text-headline-md text-on-surface">{step.label}</h2>
        {step.description && (
          <p className="text-body-md text-on-surface-variant mt-1">
            {step.description}
          </p>
        )}
      </div>

      {/* Step content */}
      <div>{step.render(data[step.id], handleChange)}</div>

      {/* Navigation */}
      <div className="flex justify-between gap-3">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isFirst}
          icon="arrow_back"
        >
          Back
        </Button>
        <Button
          variant="primary"
          onClick={handleNext}
          icon={isLast ? "check" : "arrow_forward"}
          iconPosition="right"
        >
          {isLast ? "Complete" : "Next"}
        </Button>
      </div>
    </div>
  );
}
