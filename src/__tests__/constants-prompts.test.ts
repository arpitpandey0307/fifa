// ============================================================================
// FIFA Nexus AI — Constants & Prompts Tests
// Validates all application constants and prompt templates.
// ============================================================================

import { describe, it, expect } from "vitest";
import {
  APP_NAME,
  APP_DESCRIPTION,
  APP_VERSION,
  SUPPORTED_LANGUAGES,
  RISK_THRESHOLDS,
  POLLING_INTERVALS,
  NAV_ITEMS,
  MATCH_PHASES,
} from "@/lib/constants";
import {
  DASHBOARD_SUMMARY_PROMPT,
  FAN_ASSISTANT_PROMPT,
  CROWD_PREDICTION_PROMPT,
  INCIDENT_TRIAGE_PROMPT,
  SUSTAINABILITY_PROMPT,
  TRANSPORT_PROMPT,
  buildDashboardContext,
  buildFanContext,
} from "@/lib/prompts";

describe("Constants", () => {
  it("APP_NAME is defined", () => {
    expect(APP_NAME).toBe("FIFA Nexus AI");
  });

  it("APP_VERSION follows semver format", () => {
    expect(APP_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("SUPPORTED_LANGUAGES has at least 7 languages", () => {
    expect(SUPPORTED_LANGUAGES.length).toBeGreaterThanOrEqual(7);
  });

  it("each language has required fields", () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      expect(lang).toHaveProperty("code");
      expect(lang).toHaveProperty("name");
      expect(lang).toHaveProperty("nativeName");
      expect(lang.code.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("RISK_THRESHOLDS are ordered correctly", () => {
    expect(RISK_THRESHOLDS.low).toBeLessThan(RISK_THRESHOLDS.medium);
    expect(RISK_THRESHOLDS.medium).toBeLessThan(RISK_THRESHOLDS.high);
    expect(RISK_THRESHOLDS.high).toBeLessThan(RISK_THRESHOLDS.critical);
  });

  it("POLLING_INTERVALS are positive numbers", () => {
    for (const [, value] of Object.entries(POLLING_INTERVALS)) {
      expect(value).toBeGreaterThan(0);
    }
  });

  it("NAV_ITEMS have unique IDs and valid hrefs", () => {
    const ids = NAV_ITEMS.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const item of NAV_ITEMS) {
      expect(item.href).toMatch(/^\//);
      expect(item.label).toBeTruthy();
      expect(item.icon).toBeTruthy();
    }
  });

  it("MATCH_PHASES cover full timeline", () => {
    expect(MATCH_PHASES.PRE_MATCH.start).toBeLessThan(MATCH_PHASES.FIRST_HALF.start);
    expect(MATCH_PHASES.FIRST_HALF.end).toBeLessThanOrEqual(MATCH_PHASES.HALFTIME.start);
    expect(MATCH_PHASES.SECOND_HALF.end).toBeLessThanOrEqual(MATCH_PHASES.POST_MATCH.start);
  });
});

describe("Prompt Templates", () => {
  it("all prompts are non-empty strings", () => {
    const prompts = [
      DASHBOARD_SUMMARY_PROMPT,
      FAN_ASSISTANT_PROMPT,
      CROWD_PREDICTION_PROMPT,
      INCIDENT_TRIAGE_PROMPT,
      SUSTAINABILITY_PROMPT,
      TRANSPORT_PROMPT,
    ];

    for (const prompt of prompts) {
      expect(typeof prompt).toBe("string");
      expect(prompt.length).toBeGreaterThan(50);
    }
  });

  it("DASHBOARD_SUMMARY_PROMPT requests JSON output", () => {
    expect(DASHBOARD_SUMMARY_PROMPT).toContain("JSON");
    expect(DASHBOARD_SUMMARY_PROMPT).toContain("summary");
    expect(DASHBOARD_SUMMARY_PROMPT).toContain("priorityActions");
  });

  it("FAN_ASSISTANT_PROMPT mentions multilingual support", () => {
    expect(FAN_ASSISTANT_PROMPT).toContain("language");
    expect(FAN_ASSISTANT_PROMPT).toContain("English");
    expect(FAN_ASSISTANT_PROMPT).toContain("Hindi");
  });

  it("CROWD_PREDICTION_PROMPT specifies confidence scoring", () => {
    expect(CROWD_PREDICTION_PROMPT).toContain("confidence");
    expect(CROWD_PREDICTION_PROMPT).toContain("predicted5min");
  });

  it("INCIDENT_TRIAGE_PROMPT uses chain-of-thought steps", () => {
    expect(INCIDENT_TRIAGE_PROMPT).toContain("STEP 1");
    expect(INCIDENT_TRIAGE_PROMPT).toContain("STEP 5");
  });
});

describe("Context Builders", () => {
  it("buildDashboardContext includes all data sections", () => {
    const result = buildDashboardContext({
      match: { status: "live" },
      crowd: [],
      weather: { temp: 28 },
      transport: [],
      security: {},
      medical: {},
      vendors: [],
      sustainability: {},
      alerts: [],
    });

    expect(result).toContain("Match:");
    expect(result).toContain("Crowd Zones:");
    expect(result).toContain("Weather:");
    expect(result).toContain("Transport:");
    expect(result).toContain("Timestamp:");
  });

  it("buildFanContext includes fan and stadium sections", () => {
    const result = buildFanContext(
      { seat: "A-1", language: "en" },
      { vendors: [], density: 50 }
    );

    expect(result).toContain("FAN CONTEXT");
    expect(result).toContain("STADIUM CONTEXT");
  });
});
