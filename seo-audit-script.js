// SEO Audit Script for fidelisav.com
// Run this in browser console on fidelisav.com

function auditSEO(url) {
  console.log(`🔍 SEO AUDIT FOR: ${url}`);
  console.log('==========================================');
  
  const issues = [];
  const recommendations = [];
  const passed = [];
  
  // Title check
  const title = document.title;
  console.log(`📄 Title: "${title}"`);
  if (!title) {
    issues.push('Missing page title');
  } else if (title.length < 30) {
    recommendations.push('Title could be longer (30-60 characters ideal)');
  } else if (title.length > 60) {
    recommendations.push('Title might be too long (60+ characters)');
  } else {
    passed.push('Title length is optimal');
  }
  
  // Meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  const desc = metaDesc?.getAttribute('content') || '';
  console.log(`📝 Meta Description: "${desc}"`);
  if (!desc) {
    issues.push('Missing meta description');
  } else if (desc.length < 120) {
    recommendations.push('Meta description could be longer (120-160 characters ideal)');
  } else if (desc.length > 160) {
    recommendations.push('Meta description might be too long (160+ characters)');
  } else {
    passed.push('Meta description length is optimal');
  }
  
  // Open Graph tags
  const ogTags = {
    title: document.querySelector('meta[property="og:title"]'),
    description: document.querySelector('meta[property="og:description"]'),
    image: document.querySelector('meta[property="og:image"]'),
    url: document.querySelector('meta[property="og:url"]'),
    type: document.querySelector('meta[property="og:type"]')
  };
  
  console.log('\n🌐 Open Graph Tags:');
  Object.entries(ogTags).forEach(([key, element]) => {
    if (element) {
      console.log(`  ✅ og:${key}: ${element.getAttribute('content')}`);
      passed.push(`Open Graph ${key} present`);
    } else {
      console.log(`  ❌ og:${key}: Missing`);
      issues.push(`Missing Open Graph ${key}`);
    }
  });
  
  // Twitter Cards
  const twitterCard = document.querySelector('meta[name="twitter:card"]');
  if (twitterCard) {
    console.log(`\n🐦 Twitter Card: ${twitterCard.getAttribute('content')}`);
    passed.push('Twitter Card present');
  } else {
    console.log('\n🐦 Twitter Card: Missing');
    recommendations.push('Consider adding Twitter Card meta tags');
  }
  
  // Structured data
  const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
  console.log(`\n📊 Structured Data: ${structuredData.length} scripts found`);
  if (structuredData.length === 0) {
    issues.push('No structured data found');
  } else {
    passed.push(`${structuredData.length} structured data script(s) found`);
    structuredData.forEach((script, i) => {
      try {
        const data = JSON.parse(script.textContent || '');
        console.log(`  Script ${i + 1}: ${data['@type'] || 'Unknown type'}`);
      } catch (e) {
        console.log(`  Script ${i + 1}: Invalid JSON`);
      }
    });
  }
  
  // H1 tags
  const h1Tags = document.querySelectorAll('h1');
  console.log(`\n📋 H1 Tags: ${h1Tags.length} found`);
  if (h1Tags.length === 0) {
    issues.push('No H1 tag found');
  } else if (h1Tags.length > 1) {
    recommendations.push('Multiple H1 tags found - consider using only one');
  } else {
    passed.push('Single H1 tag found');
  }
  
  // Images without alt text
  const images = document.querySelectorAll('img');
  let imagesWithoutAlt = 0;
  images.forEach(img => {
    if (!img.getAttribute('alt')) {
      imagesWithoutAlt++;
    }
  });
  console.log(`\n🖼️ Images: ${images.length} total, ${imagesWithoutAlt} missing alt text`);
  if (imagesWithoutAlt > 0) {
    issues.push(`${imagesWithoutAlt} images missing alt text`);
  } else if (images.length > 0) {
    passed.push('All images have alt text');
  }
  
  // Internal links
  const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="#"]');
  console.log(`\n🔗 Internal Links: ${internalLinks.length} found`);
  if (internalLinks.length > 0) {
    passed.push(`${internalLinks.length} internal links found`);
  }
  
  // Canonical URL
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    console.log(`\n🔗 Canonical URL: ${canonical.getAttribute('href')}`);
    passed.push('Canonical URL present');
  } else {
    console.log('\n🔗 Canonical URL: Missing');
    recommendations.push('Consider adding canonical URL');
  }
  
  // Calculate score
  const totalChecks = issues.length + recommendations.length + passed.length;
  const score = Math.round(((passed.length + (recommendations.length * 0.5)) / totalChecks) * 100);
  
  console.log('\n🎯 FINAL RESULTS:');
  console.log('==================');
  console.log(`📊 SEO Score: ${score}/100`);
  
  if (score >= 90) {
    console.log('🟢 Excellent SEO implementation!');
  } else if (score >= 75) {
    console.log('🟡 Good SEO with room for improvement');
  } else if (score >= 50) {
    console.log('🟠 Moderate SEO - needs attention');
  } else {
    console.log('🔴 Poor SEO - immediate action required');
  }
  
  if (issues.length > 0) {
    console.log('\n❌ Critical Issues:');
    issues.forEach(issue => console.log(`  • ${issue}`));
  }
  
  if (recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    recommendations.forEach(rec => console.log(`  • ${rec}`));
  }
  
  if (passed.length > 0) {
    console.log('\n✅ Passed Checks:');
    passed.forEach(pass => console.log(`  • ${pass}`));
  }
  
  return { score, issues, recommendations, passed };
}

// Run the audit
auditSEO(window.location.href);
