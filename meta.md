"metadata": {
"theme": {
"backgroundColor": "#ffffff",
"headerColor": "#165ce6ff",
"textColor": "#1f2937",
"primaryColor": "#2563eb",
"accentColor": "#9333ea"
},

"typography": {
"fontFamily": "Inter, 'Noto Sans SC', system-ui, sans-serif",
"headingFontFamily": "Inter, 'Noto Sans SC', system-ui, sans-serif",
"baseFontSize": 14,
"lineHeight": 1.6,
"fontWeight": {
"heading": 700,
"body": 400,
"emphasis": 600
},
"headingScale": {
"h1": 1.8,
"h2": 1.5,
"h3": 1.25
}
},

"icons": {
"enabled": true,
"size": 18,
"style": "outline"  // 可选：outline | filled | duotone
},

"layout": {
"direction": "vertical",           // vertical | horizontal（模块流向）
"columnCount": 2,                  // 1 或 2
"columnGap": 24,                   // 列间距（px）
"sectionSpacing": 16,              // 模块间距（px）
"contentMaxWidth": 1100,           // 页面内容最大宽度（px）
"columns": {
"left": ["summary", "workExperience", "education"],
"right": ["skills", "projects", "awards", "languages"]
}
},

"header": {
"showAvatar": false,
"avatarShape": "circle",           // circle | square
"align": "center",                 // left | center | right
"backgroundColor": null
},

"sections": {
"personalInfo": { "showIcons": true, "fontColor": null, "backgroundColor": null },
"summary":      { "fontColor": null, "backgroundColor": null },
"workExperience": { "showBullets": true, "fontColor": null, "backgroundColor": null },
"education":    { "fontColor": null, "backgroundColor": null },
"skills":       { "showBadges": true, "fontColor": null, "backgroundColor": null },
"projects":     { "fontColor": null, "backgroundColor": null },
"awards":       { "fontColor": null, "backgroundColor": null },
"languages":    { "fontColor": null, "backgroundColor": null }
},

"pdf": {
"pageSize": "A4",                  // A4 | Letter
"margins": { "top": 24, "right": 24, "bottom": 24, "left": 24 }
}
}`