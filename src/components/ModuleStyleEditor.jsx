// No header controls here; the workspace renders the sticky header

export default function ModuleStyleEditor({
  isOpen,
  onClose,
  globalMeta,
  setGlobalMeta,
  modulesMeta,
  setModulesMeta,
  openSectionKey,
  setOpenSectionKey,
  updateModuleMeta,
  emitPendingRef,
}) {
  if (!isOpen) return null

  return (
    <div className="w-full lg:w-80 h-full lg:border-l border-t bg-white dark:bg-gray-800 p-4 overflow-y-auto">
      <div className="text-sm font-medium mb-3">Module Style Editor</div>

      {/* Accordion list: Global + each section. Details unfold inline under the header */}
      <div className="mb-4">
        <div className="text-xs font-semibold mb-2">Sections</div>
        <div className="grid grid-cols-1 gap-2">
          {["global", ...Object.keys(modulesMeta)].map((key) => {
            const isSectionOpen = openSectionKey === key
            const headerLabel = key === "global" ? "Global Styles" : key
            return (
              <div key={key} className="border rounded">
                <button
                  className={`w-full text-left px-2 py-1 rounded-t transition-colors text-xs ${isSectionOpen ? 'bg-blue-50' : 'bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700'}`}
                  onClick={() => setOpenSectionKey(isSectionOpen ? null : key)}
                  aria-expanded={isSectionOpen}
                >
                  <div className="flex items-center justify-between">
                    <span className="capitalize">{headerLabel}</span>
                    <span className="text-[10px] text-gray-500">{isSectionOpen ? 'Hide' : 'Show'}</span>
                  </div>
                </button>
                {isSectionOpen && (
                  <div className="mt-2 space-y-2 px-2 pb-2">
                    {key === 'global' ? (
                      <>
                        <div className="flex items-center gap-2">
                          <label className="text-xs w-24">Title Font Size</label>
                          <input
                            type="text"
                            className="flex-1 text-xs border rounded px-2 py-1"
                            placeholder="e.g. 1.25rem"
                            value={globalMeta.titleFontSize}
                            onChange={(e) => {
                              const v = e.target.value
                              emitPendingRef.current = true
                              setGlobalMeta(prev => ({ ...prev, titleFontSize: v }))
                              setModulesMeta(prev => {
                                const next = { ...prev }
                                Object.keys(next).forEach(k => { next[k] = { ...next[k], titleFontSize: v } })
                                return next
                              })
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs w-24">Title Color</label>
                          <input
                            type="color"
                            className="h-7 w-12 p-0 border"
                            value={globalMeta.titleColor}
                            onChange={(e) => {
                              const v = e.target.value
                              emitPendingRef.current = true
                              setGlobalMeta(prev => ({ ...prev, titleColor: v }))
                              setModulesMeta(prev => {
                                const next = { ...prev }
                                Object.keys(next).forEach(k => { next[k] = { ...next[k], titleColor: v } })
                                return next
                              })
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs w-24">Title Alignment</label>
                          <select
                            className="w-28 text-xs border rounded px-2 py-1"
                            value={globalMeta.titleAlign}
                            onChange={(e) => {
                              const v = e.target.value
                              emitPendingRef.current = true
                              setGlobalMeta(prev => ({ ...prev, titleAlign: v }))
                              setModulesMeta(prev => {
                                const next = { ...prev }
                                Object.keys(next).forEach(k => { next[k] = { ...next[k], titleAlign: v } })
                                return next
                              })
                            }}
                          >
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs w-24">Primary Font Size</label>
                          <input
                            type="text"
                            className="flex-1 text-xs border rounded px-2 py-1"
                            placeholder="e.g. 1.25rem"
                            value={globalMeta.h1FontSize}
                            onChange={(e) => {
                              const v = e.target.value
                              emitPendingRef.current = true
                              setGlobalMeta(prev => ({ ...prev, h1FontSize: v }))
                              setModulesMeta(prev => {
                                const next = { ...prev }
                                Object.keys(next).forEach(k => { next[k] = { ...next[k], h1FontSize: v } })
                                return next
                              })
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs w-24">Primary Color</label>
                          <input
                            type="color"
                            className="h-7 w-12 p-0 border"
                            value={globalMeta.h1FontColor}
                            onChange={(e) => {
                              const v = e.target.value
                              emitPendingRef.current = true
                              setGlobalMeta(prev => ({ ...prev, h1FontColor: v }))
                              setModulesMeta(prev => {
                                const next = { ...prev }
                                Object.keys(next).forEach(k => { next[k] = { ...next[k], h1FontColor: v } })
                                return next
                              })
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs w-24">Primary Alignment</label>
                          <select
                            className="w-28 text-xs border rounded px-2 py-1"
                            value={globalMeta.h1Align}
                            onChange={(e) => {
                              const v = e.target.value
                              emitPendingRef.current = true
                              setGlobalMeta(prev => ({ ...prev, h1Align: v }))
                              setModulesMeta(prev => {
                                const next = { ...prev }
                                Object.keys(next).forEach(k => { next[k] = { ...next[k], h1Align: v } })
                                return next
                              })
                            }}
                          >
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs w-24">Secondary Font Size</label>
                          <input
                            type="text"
                            className="flex-1 text-xs border rounded px-2 py-1"
                            placeholder="e.g. 1rem"
                            value={globalMeta.h2FontSize}
                            onChange={(e) => {
                              const v = e.target.value
                              emitPendingRef.current = true
                              setGlobalMeta(prev => ({ ...prev, h2FontSize: v }))
                              setModulesMeta(prev => {
                                const next = { ...prev }
                                Object.keys(next).forEach(k => { next[k] = { ...next[k], h2FontSize: v } })
                                return next
                              })
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs w-24">Secondary Color</label>
                          <input
                            type="color"
                            className="h-7 w-12 p-0 border"
                            value={globalMeta.h2FontColor}
                            onChange={(e) => {
                              const v = e.target.value
                              emitPendingRef.current = true
                              setGlobalMeta(prev => ({ ...prev, h2FontColor: v }))
                              setModulesMeta(prev => {
                                const next = { ...prev }
                                Object.keys(next).forEach(k => { next[k] = { ...next[k], h2FontColor: v } })
                                return next
                              })
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs w-24">Secondary Alignment</label>
                          <select
                            className="w-28 text-xs border rounded px-2 py-1"
                            value={globalMeta.h2Align}
                            onChange={(e) => {
                              const v = e.target.value
                              emitPendingRef.current = true
                              setGlobalMeta(prev => ({ ...prev, h2Align: v }))
                              setModulesMeta(prev => {
                                const next = { ...prev }
                                Object.keys(next).forEach(k => { next[k] = { ...next[k], h2Align: v } })
                                return next
                              })
                            }}
                          >
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs w-24">Line Height</label>
                          <input
                            type="text"
                            className="w-28 text-xs border rounded px-2 py-1"
                            placeholder="e.g. 1.6"
                            value={globalMeta.lineHeight}
                            onChange={(e) => {
                              const v = e.target.value
                              emitPendingRef.current = true
                              setGlobalMeta(prev => ({ ...prev, lineHeight: v }))
                              setModulesMeta(prev => {
                                const next = { ...prev }
                                Object.keys(next).forEach(k => { next[k] = { ...next[k], lineHeight: v } })
                                return next
                              })
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs w-24">Section Padding</label>
                          <input
                            type="text"
                            className="w-28 text-xs border rounded px-2 py-1"
                            placeholder="e.g. 1rem"
                            value={globalMeta.sectionPadding}
                            onChange={(e) => {
                              const v = e.target.value
                              emitPendingRef.current = true
                              setGlobalMeta(prev => ({ ...prev, sectionPadding: v }))
                              setModulesMeta(prev => {
                                const next = { ...prev }
                                Object.keys(next).forEach(k => { next[k] = { ...next[k], sectionPadding: v } })
                                return next
                              })
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs w-24">Module Spacing</label>
                          <input
                            type="text"
                            className="w-28 text-xs border rounded px-2 py-1"
                            placeholder="e.g. 2rem"
                            value={globalMeta.moduleSpacingRem}
                            onChange={(e) => {
                              const v = e.target.value
                              emitPendingRef.current = true
                              setGlobalMeta(prev => ({ ...prev, moduleSpacingRem: v }))
                              setModulesMeta(prev => {
                                const next = { ...prev }
                                Object.keys(next).forEach(k => { next[k] = { ...next[k], moduleSpacingRem: v } })
                                return next
                              })
                            }}
                          />
                        </div>
                      </>
                    ) : (
                      (() => {
                        const meta = modulesMeta[key]
                        return (
                          <>
                            <div className="flex items-center gap-2">
                              <label className="text-xs w-20">Background</label>
                              <input type="color" value={meta.bgColor} onChange={(e) => updateModuleMeta(key, { bgColor: e.target.value })} className="h-7 w-12 p-0 border" />
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-xs w-20">Title Color</label>
                              <input type="color" value={meta.titleColor} onChange={(e) => updateModuleMeta(key, { titleColor: e.target.value })} className="h-7 w-12 p-0 border" />
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-xs w-20">Icon Color</label>
                              <input type="color" value={meta.iconColor} onChange={(e) => updateModuleMeta(key, { iconColor: e.target.value })} className="h-7 w-12 p-0 border" />
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-xs w-20">Show Icon</label>
                              <input type="checkbox" checked={!!meta.showIcon} onChange={(e) => updateModuleMeta(key, { showIcon: e.target.checked })} />
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-xs w-20">Title Font Size</label>
                              <input type="text" value={meta.titleFontSize} onChange={(e) => updateModuleMeta(key, { titleFontSize: e.target.value })} placeholder="e.g. 1.25rem" className="flex-1 text-xs border rounded px-2 py-1" />
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-xs w-20">Title Alignment</label>
                              <select value={meta.titleAlign} onChange={(e) => updateModuleMeta(key, { titleAlign: e.target.value })} className="w-28 text-xs border rounded px-2 py-1">
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                              </select>
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-xs w-20">Primary Font Size</label>
                              <input type="text" value={meta.h1FontSize} onChange={(e) => updateModuleMeta(key, { h1FontSize: e.target.value })} placeholder="e.g. 1.25rem" className="flex-1 text-xs border rounded px-2 py-1" />
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-xs w-20">Primary Color</label>
                              <input type="color" value={meta.h1FontColor} onChange={(e) => updateModuleMeta(key, { h1FontColor: e.target.value })} className="h-7 w-12 p-0 border" />
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-xs w-20">Primary Alignment</label>
                              <select value={meta.h1Align} onChange={(e) => updateModuleMeta(key, { h1Align: e.target.value })} className="w-28 text-xs border rounded px-2 py-1">
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                              </select>
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-xs w-20">Secondary Font Size</label>
                              <input type="text" value={meta.h2FontSize} onChange={(e) => updateModuleMeta(key, { h2FontSize: e.target.value })} placeholder="e.g. 1rem" className="flex-1 text-xs border rounded px-2 py-1" />
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-xs w-20">Secondary Color</label>
                              <input type="color" value={meta.h2FontColor} onChange={(e) => updateModuleMeta(key, { h2FontColor: e.target.value })} className="h-7 w-12 p-0 border" />
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-xs w-20">Secondary Alignment</label>
                              <select value={meta.h2Align} onChange={(e) => updateModuleMeta(key, { h2Align: e.target.value })} className="w-28 text-xs border rounded px-2 py-1">
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                              </select>
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-xs w-20">Line Height</label>
                              <input type="text" value={meta.lineHeight} onChange={(e) => updateModuleMeta(key, { lineHeight: e.target.value })} placeholder="e.g. 1.6" className="w-28 text-xs border rounded px-2 py-1" />
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-xs w-20">Section Padding</label>
                              <input type="text" value={meta.sectionPadding} onChange={(e) => updateModuleMeta(key, { sectionPadding: e.target.value })} placeholder="e.g. 1rem" className="w-28 text-xs border rounded px-2 py-1" />
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-xs w-20">Module Spacing</label>
                              <input type="text" value={meta.moduleSpacingRem} onChange={(e) => updateModuleMeta(key, { moduleSpacingRem: e.target.value })} placeholder="e.g. 2rem" className="w-28 text-xs border rounded px-2 py-1" />
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-xs w-20">Min Height (rem)</label>
                              <input
                                type="text"
                                value={meta.heightRem || ''}
                                onChange={(e) => updateModuleMeta(key, { heightRem: e.target.value, heightLocked: true })}
                                placeholder="e.g. 12rem"
                                className="w-28 text-xs border rounded px-2 py-1"
                              />
                            </div>

                            {/* Personal Info: photo options */}
                            {key === 'personalInfo' && (
                              <>
                                <div className="flex items-center gap-2">
                                  <label className="text-xs w-20">Show Photo</label>
                                  <input type="checkbox" checked={!!meta.showPhoto} onChange={(e) => updateModuleMeta(key, { showPhoto: e.target.checked })} />
                                </div>
                                <div className="flex items-center gap-2">
                                  <label className="text-xs w-20">Photo URL</label>
                                  <input type="text" value={meta.photoUrl || ''} onChange={(e) => updateModuleMeta(key, { photoUrl: e.target.value })} placeholder="https://... or data:image/..." className="flex-1 text-xs border rounded px-2 py-1" />
                                </div>
                                <div className="flex items-center gap-2">
                                  <label className="text-xs w-20">Upload</label>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="text-xs"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0]
                                      if (!file) return
                                      const reader = new FileReader()
                                      reader.onload = () => {
                                        const url = reader.result
                                        updateModuleMeta(key, { photoUrl: url, showPhoto: true })
                                      }
                                      reader.readAsDataURL(file)
                                    }}
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <label className="text-xs w-20">Photo Size</label>
                                  <input type="text" value={meta.photoSize || ''} onChange={(e) => updateModuleMeta(key, { photoSize: e.target.value })} placeholder="e.g. 72px or 4.5rem" className="w-28 text-xs border rounded px-2 py-1" />
                                </div>
                                <div className="flex items-center gap-2">
                                  <label className="text-xs w-20">Photo Position</label>
                                  <select value={meta.photoPosition || 'left'} onChange={(e) => updateModuleMeta(key, { photoPosition: e.target.value })} className="w-28 text-xs border rounded px-2 py-1">
                                    <option value="left">Left</option>
                                    <option value="right">Right</option>
                                  </select>
                                </div>
                              </>
                            )}
                          </>
                        )
                      })()
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}