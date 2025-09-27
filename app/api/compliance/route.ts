import { NextRequest, NextResponse } from 'next/server';
import { ComplianceRiskAssessment } from '@/lib/compliance/risk-assessment';
import { Listing } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listing }: { listing: Listing } = body;

    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: listing' },
        { status: 400 }
      );
    }

    // Perform compliance assessment
    const complianceCheck = ComplianceRiskAssessment.assessCompliance(listing);
    const violations = ComplianceRiskAssessment.checkAccessibilityViolations(listing);
    const discriminationRisks = ComplianceRiskAssessment.checkDiscriminationRisks(listing);
    const mitigationStrategies = ComplianceRiskAssessment.generateRiskMitigationStrategies(complianceCheck);
    const report = ComplianceRiskAssessment.generateComplianceReport(listing);

    return NextResponse.json({
      success: true,
      data: {
        compliance_check: complianceCheck,
        accessibility_violations: violations,
        discrimination_risks: discriminationRisks,
        mitigation_strategies: mitigationStrategies,
        compliance_report: report,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error performing compliance assessment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to perform compliance assessment' },
      { status: 500 }
    );
  }
}
