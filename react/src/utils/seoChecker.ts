interface SEOCheckResult {
  score: number;
  issues: string[];
  recommendations: string[];
  passed: string[];
}

export function checkPageSEO(document: Document): SEOCheckResult {
  const issues: string[] = [];
  const recommendations: string[] = [];
  const passed: string[] = [];

  // Title tag checks
  const title = document.querySelector('title');
  if (!title || !title.textContent) {
    issues.push('Missing page title');
  } else if (title.textContent.length < 30) {
    recommendations.push('Title could be longer (30-60 characters ideal)');
  } else if (title.textContent.length > 60) {
    recommendations.push('Title might be too long (60+ characters)');
  } else {
    passed.push('Title length is optimal');
  }

  // Meta description checks
  const metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc || !metaDesc.getAttribute('content')) {
    issues.push('Missing meta description');
  } else {
    const desc = metaDesc.getAttribute('content') || '';
    if (desc.length < 120) {
      recommendations.push('Meta description could be longer (120-160 characters ideal)');
    } else if (desc.length > 160) {
      recommendations.push('Meta description might be too long (160+ characters)');
    } else {
      passed.push('Meta description length is optimal');
    }
  }

  // Open Graph checks
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDesc = document.querySelector('meta[property="og:description"]');
  const ogImage = document.querySelector('meta[property="og:image"]');
  const ogUrl = document.querySelector('meta[property="og:url"]');

  if (!ogTitle) issues.push('Missing Open Graph title');
  else passed.push('Open Graph title present');
  
  if (!ogDesc) issues.push('Missing Open Graph description');
  else passed.push('Open Graph description present');
  
  if (!ogImage) recommendations.push('Consider adding Open Graph image');
  else passed.push('Open Graph image present');
  
  if (!ogUrl) recommendations.push('Consider adding Open Graph URL');
  else passed.push('Open Graph URL present');

  // Twitter Card checks
  const twitterCard = document.querySelector('meta[name="twitter:card"]');
  if (!twitterCard) {
    recommendations.push('Consider adding Twitter Card meta tags');
  } else {
    passed.push('Twitter Card present');
  }

  // Canonical URL check
  const canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    recommendations.push('Consider adding canonical URL');
  } else {
    passed.push('Canonical URL present');
  }

  // Structured data check
  const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
  if (structuredData.length === 0) {
    issues.push('No structured data found');
  } else {
    passed.push(`${structuredData.length} structured data script(s) found`);
  }

  // H1 tag check
  const h1Tags = document.querySelectorAll('h1');
  if (h1Tags.length === 0) {
    issues.push('No H1 tag found');
  } else if (h1Tags.length > 1) {
    recommendations.push('Multiple H1 tags found - consider using only one');
  } else {
    passed.push('Single H1 tag found');
  }

  // Image alt text check
  const images = document.querySelectorAll('img');
  let imagesWithoutAlt = 0;
  images.forEach(img => {
    if (!img.getAttribute('alt')) {
      imagesWithoutAlt++;
    }
  });

  if (imagesWithoutAlt > 0) {
    issues.push(`${imagesWithoutAlt} images missing alt text`);
  } else if (images.length > 0) {
    passed.push('All images have alt text');
  }

  // Internal linking
  const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="#"]');
  if (internalLinks.length > 0) {
    passed.push(`${internalLinks.length} internal links found`);
  }

  // Mobile meta viewport
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    issues.push('Missing viewport meta tag');
  } else {
    passed.push('Viewport meta tag present');
  }

  // Calculate score
  const totalChecks = issues.length + recommendations.length + passed.length;
  const score = Math.round(((passed.length + (recommendations.length * 0.5)) / totalChecks) * 100);

  return {
    score,
    issues,
    recommendations,
    passed
  };
}

export function printSEOReport(result: SEOCheckResult): void {
  console.log('\n🔍 SEO AUDIT REPORT');
  console.log('==================');
  console.log(`📊 Overall Score: ${result.score}/100`);
  
  // Debug: Check what meta tags are actually present
  console.log('\n🔍 DEBUG - Found Meta Tags:');
  const allMeta = document.querySelectorAll('meta');
  allMeta.forEach(meta => {
    const name = meta.getAttribute('name') || meta.getAttribute('property');
    const content = meta.getAttribute('content');
    if (name && content) {
      console.log(`  ${name}: ${content.substring(0, 100)}${content.length > 100 ? '...' : ''}`);
    }
  });
  
  console.log('\n🔍 DEBUG - Structured Data:');
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  console.log(`  Found ${scripts.length} structured data scripts`);
  scripts.forEach((script, i) => {
    console.log(`  Script ${i + 1}:`, script.textContent?.substring(0, 100) + '...');
  });
  
  if (result.score >= 90) {
    console.log('🟢 Excellent SEO implementation!');
  } else if (result.score >= 75) {
    console.log('🟡 Good SEO with room for improvement');
  } else if (result.score >= 50) {
    console.log('🟠 Moderate SEO - needs attention');
  } else {
    console.log('🔴 Poor SEO - immediate action required');
  }

  if (result.issues.length > 0) {
    console.log('\n❌ Critical Issues:');
    result.issues.forEach(issue => console.log(`  • ${issue}`));
  }

  if (result.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    result.recommendations.forEach(rec => console.log(`  • ${rec}`));
  }

  if (result.passed.length > 0) {
    console.log('\n✅ Passed Checks:');
    result.passed.forEach(pass => console.log(`  • ${pass}`));
  }

  console.log('\n');
}
