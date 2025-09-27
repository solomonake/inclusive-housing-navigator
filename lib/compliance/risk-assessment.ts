import { Listing, ComplianceCheck } from '@/types';

export class ComplianceRiskAssessment {
  /**
   * Perform FHA/ADA compliance check
   */
  static assessCompliance(listing: Listing): ComplianceCheck {
    const flaggedFields: string[] = [];
    const recommendations: string[] = [];
    let fhaCompliant = true;
    let adaCompliant = true;
    let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
    let complianceScore = 100;

    // FHA Compliance Checks
    if (!listing.anti_discrimination_policy) {
      flaggedFields.push('Anti-discrimination policy');
      fhaCompliant = false;
      complianceScore -= 20;
      recommendations.push('Implement clear anti-discrimination policy');
    }

    if (!listing.responsive_comms) {
      flaggedFields.push('Communication responsiveness');
      fhaCompliant = false;
      complianceScore -= 15;
      recommendations.push('Improve communication responsiveness');
    }

    // ADA Compliance Checks
    if (!listing.step_free_entry && !listing.elevator) {
      flaggedFields.push('Accessible entry');
      adaCompliant = false;
      complianceScore -= 25;
      recommendations.push('Provide step-free entry or elevator access');
    }

    if (listing.doorway_width < 32) {
      flaggedFields.push('Doorway width');
      adaCompliant = false;
      complianceScore -= 20;
      recommendations.push('Ensure doorways are at least 32 inches wide');
    }

    if (!listing.accessible_bathroom) {
      flaggedFields.push('Accessible bathroom');
      adaCompliant = false;
      complianceScore -= 15;
      recommendations.push('Provide accessible bathroom facilities');
    }

    if (!listing.accessible_parking) {
      flaggedFields.push('Accessible parking');
      adaCompliant = false;
      complianceScore -= 10;
      recommendations.push('Provide accessible parking spaces');
    }

    // Additional Risk Factors
    if (listing.management_hours === '9-17' || listing.management_hours === '9-18') {
      flaggedFields.push('Limited management hours');
      complianceScore -= 5;
      recommendations.push('Consider extending management hours for better accessibility');
    }

    if (!listing.lit_streets) {
      flaggedFields.push('Street lighting');
      complianceScore -= 5;
      recommendations.push('Ensure adequate street lighting for safety');
    }

    // Determine risk level
    if (flaggedFields.length >= 4) {
      riskLevel = 'High';
    } else if (flaggedFields.length >= 2) {
      riskLevel = 'Medium';
    }

    // Add general recommendations
    if (!fhaCompliant || !adaCompliant) {
      recommendations.push('Consult with legal counsel for compliance review');
      recommendations.push('Consider accessibility audit by certified professional');
    }

    return {
      fha_compliant: fhaCompliant,
      ada_compliant: adaCompliant,
      risk_level: riskLevel,
      flagged_fields: flaggedFields,
      recommendations: recommendations,
      compliance_score: Math.max(0, complianceScore)
    };
  }

  /**
   * Generate compliance report
   */
  static generateComplianceReport(listing: Listing): string {
    const assessment = this.assessCompliance(listing);
    
    let report = `# Compliance Assessment Report\n\n`;
    report += `**Property:** ${listing.name}\n`;
    report += `**Address:** ${listing.address}\n`;
    report += `**Assessment Date:** ${new Date().toLocaleDateString()}\n\n`;

    report += `## Compliance Status\n`;
    report += `- **FHA Compliant:** ${assessment.fha_compliant ? '✅ Yes' : '❌ No'}\n`;
    report += `- **ADA Compliant:** ${assessment.ada_compliant ? '✅ Yes' : '❌ No'}\n`;
    report += `- **Risk Level:** ${assessment.risk_level}\n`;
    report += `- **Compliance Score:** ${assessment.compliance_score}/100\n\n`;

    if (assessment.flagged_fields.length > 0) {
      report += `## Flagged Fields\n`;
      assessment.flagged_fields.forEach(field => {
        report += `- ❌ ${field}\n`;
      });
      report += `\n`;
    }

    if (assessment.recommendations.length > 0) {
      report += `## Recommendations\n`;
      assessment.recommendations.forEach(rec => {
        report += `- 💡 ${rec}\n`;
      });
      report += `\n`;
    }

    report += `## Legal References\n`;
    report += `- [Fair Housing Act (FHA)](https://www.hud.gov/program_offices/fair_housing_equal_opp/fair_housing_act_overview)\n`;
    report += `- [Americans with Disabilities Act (ADA)](https://www.ada.gov/)\n`;
    report += `- [Section 504 of the Rehabilitation Act](https://www.hud.gov/program_offices/fair_housing_equal_opp/disabilities/sect504)\n\n`;

    report += `**Note:** This assessment is for informational purposes only and does not constitute legal advice. Consult with qualified legal counsel for compliance matters.\n`;

    return report;
  }

  /**
   * Check for specific accessibility violations
   */
  static checkAccessibilityViolations(listing: Listing): string[] {
    const violations: string[] = [];

    // Entry accessibility
    if (!listing.step_free_entry && !listing.elevator) {
      violations.push('No accessible entry - requires step-free entry or elevator');
    }

    // Doorway width
    if (listing.doorway_width < 32) {
      violations.push(`Doorway width (${listing.doorway_width}") below ADA minimum (32")`);
    }

    // Bathroom accessibility
    if (!listing.accessible_bathroom) {
      violations.push('No accessible bathroom facilities');
    }

    // Parking accessibility
    if (!listing.accessible_parking) {
      violations.push('No accessible parking spaces');
    }

    return violations;
  }

  /**
   * Check for discrimination risks
   */
  static checkDiscriminationRisks(listing: Listing): string[] {
    const risks: string[] = [];

    // International student acceptance
    if (!listing.accepts_international) {
      risks.push('May discriminate against international students');
    }

    // SSN requirements
    if (!listing.no_ssn_required) {
      risks.push('SSN requirement may exclude certain populations');
    }

    // Cosigner policies
    if (!listing.allows_cosigner) {
      risks.push('No cosigner option may limit accessibility');
    }

    // Communication policies
    if (!listing.responsive_comms) {
      risks.push('Poor communication may indicate discriminatory practices');
    }

    return risks;
  }

  /**
   * Generate risk mitigation strategies
   */
  static generateRiskMitigationStrategies(assessment: ComplianceCheck): string[] {
    const strategies: string[] = [];

    if (!assessment.fha_compliant) {
      strategies.push('Implement comprehensive anti-discrimination training for staff');
      strategies.push('Develop clear, written policies for tenant selection and communication');
      strategies.push('Establish regular compliance monitoring and review processes');
    }

    if (!assessment.ada_compliant) {
      strategies.push('Conduct accessibility audit by certified professional');
      strategies.push('Develop accessibility improvement plan with timeline');
      strategies.push('Consider reasonable accommodations for existing barriers');
    }

    if (assessment.risk_level === 'High') {
      strategies.push('Immediate legal consultation recommended');
      strategies.push('Consider temporary compliance measures while improvements are made');
      strategies.push('Develop comprehensive compliance action plan');
    }

    if (assessment.risk_level === 'Medium') {
      strategies.push('Schedule compliance review within 30 days');
      strategies.push('Implement interim accessibility measures where possible');
      strategies.push('Develop staff training program on fair housing laws');
    }

    return strategies;
  }
}
