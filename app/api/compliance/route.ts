import { NextRequest, NextResponse } from 'next/server';

interface ComplianceCheck {
  fha_compliant: boolean;
  ada_compliant: boolean;
  risk_level: 'Low' | 'Medium' | 'High';
  flagged_fields: string[];
  recommendations: string[];
  compliance_score: number;
  detailed_breakdown: {
    fha_violations: string[];
    ada_violations: string[];
    safety_concerns: string[];
    inclusivity_issues: string[];
  };
  risk_mitigation: {
    immediate_actions: string[];
    long_term_improvements: string[];
    legal_considerations: string[];
  };
}

interface ComplianceRequest {
  listing_id: string;
  user_needs?: {
    accessibility_requirements: string[];
    international_student: boolean;
    budget_constraints: boolean;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { listing_id, user_needs }: ComplianceRequest = await request.json();

    if (!listing_id) {
      return NextResponse.json(
        { error: 'Listing ID is required' },
        { status: 400 }
      );
    }

    // Mock listing data - in production, this would fetch from database
    const mockListing = {
      id: listing_id,
      title: 'Sample Housing Listing',
      addr: '123 University Ave, Blacksburg, VA',
      rent: 1200,
      step_free: true,
      elevator: true,
      doorway_width_cm: 91,
      acc_bath: true,
      acc_parking: true,
      well_lit: true,
      mgmt_hours_late: '24/7',
      accepts_international: true,
      no_ssn_ok: true,
      cosigner_ok: true,
      anti_disc_policy: true,
      dist_to_campus_km: 0.5
    };

    // FHA Compliance Checks
    const fhaViolations = [];
    const adaViolations = [];
    const safetyConcerns = [];
    const inclusivityIssues = [];
    const flaggedFields = [];
    const recommendations = [];
    let complianceScore = 100;

    // FHA Compliance
    if (!mockListing.anti_disc_policy) {
      fhaViolations.push('Missing explicit anti-discrimination policy');
      flaggedFields.push('Anti-discrimination policy');
      complianceScore -= 20;
      recommendations.push('Implement clear anti-discrimination policy');
    }

    if (!mockListing.accepts_international) {
      fhaViolations.push('Does not explicitly accept international students');
      flaggedFields.push('International student acceptance');
      complianceScore -= 15;
      recommendations.push('Consider accepting international students');
    }

    if (!mockListing.no_ssn_ok) {
      fhaViolations.push('Requires Social Security Number (SSN)');
      flaggedFields.push('SSN requirement');
      complianceScore -= 10;
      recommendations.push('Consider flexible SSN requirements');
    }

    if (!mockListing.cosigner_ok) {
      fhaViolations.push('Does not allow co-signers');
      flaggedFields.push('Co-signer policy');
      complianceScore -= 10;
      recommendations.push('Allow co-signers for students');
    }

    // ADA Compliance
    if (!mockListing.step_free && !mockListing.elevator) {
      adaViolations.push('No step-free entry or elevator access');
      flaggedFields.push('Accessible entry');
      complianceScore -= 25;
      recommendations.push('Provide step-free entry or elevator access');
    }

    if ((mockListing.doorway_width_cm || 0) < 81) {
      adaViolations.push(`Doorway width (${mockListing.doorway_width_cm || 'N/A'}cm) below ADA minimum (81cm/32")`);
      flaggedFields.push('Doorway width');
      complianceScore -= 20;
      recommendations.push('Ensure doorways are at least 32 inches wide (81 cm)');
    }

    if (!mockListing.acc_bath) {
      adaViolations.push('No accessible bathroom facilities');
      flaggedFields.push('Accessible bathroom');
      complianceScore -= 15;
      recommendations.push('Provide accessible bathroom facilities');
    }

    if (!mockListing.acc_parking) {
      adaViolations.push('No accessible parking available');
      flaggedFields.push('Accessible parking');
      complianceScore -= 10;
      recommendations.push('Ensure accessible parking is available');
    }

    // Safety Checks
    if ((mockListing.dist_to_campus_km || 0) > 2.0) {
      safetyConcerns.push('Far from campus - potential safety concerns');
      flaggedFields.push('Distance to campus');
      complianceScore -= 10;
      recommendations.push('Consider properties closer to campus for safety');
    }

    if (!mockListing.well_lit) {
      safetyConcerns.push('Poor lighting in common areas');
      flaggedFields.push('Lighting');
      complianceScore -= 5;
      recommendations.push('Ensure adequate lighting in common areas');
    }

    if ((mockListing.mgmt_hours_late || '') === '9-17') {
      safetyConcerns.push('Limited management hours');
      flaggedFields.push('Management hours');
      complianceScore -= 5;
      recommendations.push('Consider properties with extended management hours');
    }

    // Inclusivity Checks
    if (!mockListing.accepts_international && user_needs?.international_student) {
      inclusivityIssues.push('Not suitable for international students');
      flaggedFields.push('International student support');
      complianceScore -= 15;
      recommendations.push('Find properties that explicitly welcome international students');
    }

    // Determine risk level
    let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
    if (complianceScore < 50 || flaggedFields.length >= 3) {
      riskLevel = 'High';
    } else if (complianceScore < 80 || flaggedFields.length >= 1) {
      riskLevel = 'Medium';
    }

    // Generate risk mitigation strategies
    const immediateActions = [];
    const longTermImprovements = [];
    const legalConsiderations = [];

    if (riskLevel === 'High') {
      immediateActions.push('Review all flagged compliance issues before signing lease');
      immediateActions.push('Request written documentation of accessibility features');
      immediateActions.push('Consider alternative housing options');
    } else if (riskLevel === 'Medium') {
      immediateActions.push('Address critical compliance issues with landlord');
      immediateActions.push('Document all accessibility features in writing');
    }

    if (fhaViolations.length > 0) {
      legalConsiderations.push('FHA violations may affect fair housing compliance');
      legalConsiderations.push('Consider consulting with housing rights organization');
    }

    if (adaViolations.length > 0) {
      legalConsiderations.push('ADA violations may affect accessibility compliance');
      legalConsiderations.push('Request accessibility modifications if needed');
    }

    longTermImprovements.push('Work with landlord to improve accessibility features');
    longTermImprovements.push('Advocate for better inclusive housing policies');
    longTermImprovements.push('Document and report compliance issues to relevant authorities');

    const complianceCheck: ComplianceCheck = {
      fha_compliant: fhaViolations.length === 0,
      ada_compliant: adaViolations.length === 0,
      risk_level: riskLevel,
      flagged_fields: flaggedFields,
      recommendations,
      compliance_score: Math.max(0, complianceScore),
      detailed_breakdown: {
        fha_violations: fhaViolations,
        ada_violations: adaViolations,
        safety_concerns: safetyConcerns,
        inclusivity_issues: inclusivityIssues
      },
      risk_mitigation: {
        immediate_actions: immediateActions,
        long_term_improvements: longTermImprovements,
        legal_considerations: legalConsiderations
      }
    };

    return NextResponse.json(complianceCheck);

  } catch (error) {
    console.error('Compliance check error:', error);
    return NextResponse.json(
      { error: 'Failed to perform compliance check' },
      { status: 500 }
    );
  }
}