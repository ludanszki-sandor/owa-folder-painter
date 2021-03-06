const colorIDprefix = 'col_'
const colorListSeparator = ';'
const colorTableBodyID = 'folder-painter-folder-options-tbody'

const iconIDprefix = 'ico_'
const iconTableBodyID = 'folder-painter-icon-options-tbody'

const colorLineIDPrefix = 'colLine_'
const iconLineIDPrefix = 'icoLine_'

const cmdRemoveColor = 'remove-color'
const cmdChangeColor = 'change-color'
const cmdChangeColorNoSave = 'change-color-no-save'

const cmdRemoveIcon = 'remove-icon'
const cmdChangeIcon = 'change-icon'
const cmdChangeIconNoSave = 'change-icon-no-save'

const emojiDelete = '❌'
const emojiSave = '💾'
const emojiAppend = '➕'
const emojiLoadFile = '✔️'

const emojiResetConfig = '🆑'
const emojiSwitchLang = '👅'
const emojiLoadFileRadio = emojiLoadFile

const sandboxDivCoreID = 'folder-painter-sandbox-div-core'
const jsonDivCoreID = 'folder-painter-json-options-div-core'

const cmdLoadJSON = 'load-json'
const loadJSONtextAreaID = 'json-textarea'
const cmdResetConfig = 'reset-config'
const questionResetConfig = 'Are you sure?'

const cmdSwitchLanguage = 'switch-language'

const radiobuttonsDivCoreID = 'folder-painter-radio-buttons-div-core'
const radiobuttonsDivID = 'folder-painter-radio-buttons-div'

const radioGroupName = 'folder-painter-radio-group'

const cmdRadioButton = 'radio-button'

const radioButtonsData_IDs = {
    panel_colors : 'panel_colors',
    panel_icons : 'panel_icons',
    panel_json : 'panel_json',
    panel_help : 'panel_help',
    panel_sandbox : 'panel_sandbox',
    error : 'error'
}
const radioButtonsData = [
    {id:radioButtonsData_IDs.panel_colors,text:'🎨 - Customize colors',radio_span_id : 'radio-colors'},
    {id:radioButtonsData_IDs.panel_icons,text:'🍒 - Replace icons',radio_span_id : 'radio-icons'},
    {id:radioButtonsData_IDs.panel_json,text:`${emojiLoadFileRadio} - Load from JSON`,radio_span_id : 'radio-json'},
//    {id:radioButtonsData_IDs.panel_help,text:`❓ - Help`,radio_span_id : 'radio-help'},
//    {id:radioButtonsData_IDs.panel_sandbox,text:`😎 - Sandbox`,radio_span_id : 'radio-sandbox'},
]

const contentDivIDs = {
    radio: {id:"radiobuttons_place",raw:false},
    panel: {id:"configpanel_place",raw:DEBUG_SHOW_RAW_CONTENT}
}


const helpDivCoreID = 'folder-painter-help-options-div-core'
const radioButtonsHTMLSeparator = '&nbsp;&nbsp;'
const formID = 'folder-painter-form-id'

let tooltips = {
    iconName : 'Icon name',
    iconText : 'Icon emoji or PNG base64 data',
    iconColor : 'Icon emoji color',
    iconSave : 'Save changes',
    iconDelete : 'Delete entry',

    iconNameNew : 'New icon name',
    iconTextNew : 'New icon emoji or PNG base64 data',
    iconColorNew : 'New icon emoji color',
    iconAppendNew : 'Save new entry',

    folderName : 'Folder name',
    textColor : 'Modify textColor',
    textBGColor : 'Modify textBackgroundColor',
    folderIconText : 'Folder icon emoji or PNG base64 data',
    textDelete : 'Delete entry',

    folderNameNew : 'New folder name',
    textColorNew : 'New textColor',
    textBGColorNew : 'New textBackgroundColor',
    folderIconTextNew : 'New older icon emoji or PNG base64 data',
    folderAppendNew : 'Save new entry',

    loadConfig : 'Load configuration from JSON',
    resetConfig : 'Reset to default configuration',
    switchLanguage : 'Switch to next language'
}


function restoreOptions(){
    browser.storage.local.get(config_field_names).then(onLoadConfigOK,onLoadConfigError).then(onFinishConfig)
}

function getScreenElementValue(id){
    let elem = document.getElementById(id)
    if (elem && elem.hasAttribute('value')){
        return  elem.value
    } else {
        //debugLog(['id not found',id])
        return null
    }
}

function setScreenElementValue(id,new_value){
    let elem = document.getElementById(id)
    if (elem && elem.hasAttribute('value')){
        elem.value = new_value
        return true
    } else {
        //debugLog(['id not found',id])
        return null
    }
}

function getActiveTabID(tab_index){
    return radioButtonsData[tab_index]?.id ?? null
}

function saveTabScreenElements(tab_index){
    let tabID = getActiveTabID(tab_index)
    let testValue
    if (tabID === radioButtonsData_IDs.panel_colors){
        for (let i = 0;i < config.colors.length;i++){
            testValue = getScreenElementValue(colorIDprefix + i + '+0')
            if (testValue !== config.colors[i].folderName) {
                // error
            } else {
                config.colors[i].textColor = getScreenElementValue(colorIDprefix + i + '+1') ?? config.colors[i].textColor
                config.colors[i].textBGColor = getScreenElementValue(colorIDprefix + i + '+2') ?? config.colors[i].textBGColor
                config.colors[i].folderEmoji = getScreenElementValue(colorIDprefix + i + '+3') ?? config.colors[i].folderEmoji
            }
        }
        config.default_values.newFolder = getScreenElementValue(colorIDprefix + '-1+0') ?? config.default_values.newFolder
        config.default_values.textColor = getScreenElementValue(colorIDprefix + '-1+1') ?? config.default_values.textColor
        config.default_values.textBGColor = getScreenElementValue(colorIDprefix + '-1+2') ?? config.default_values.textBGColor
        config.default_values.folderEmoji = getScreenElementValue(colorIDprefix + '-1+3') ?? config.default_values.folderEmoji
    } else if (tabID === radioButtonsData_IDs.panel_icons){
        for (let i = 0;i < config.icons.length;i++){
            testValue = getScreenElementValue(iconIDprefix + i + '+0')
            if (testValue !== config.icons[i].iconName) {
                // error
            } else {
                config.icons[i].iconText = getScreenElementValue(iconIDprefix + i + '+1') ?? config.icons[i].iconText
                config.icons[i].iconColor = getScreenElementValue(iconIDprefix + i + '+2') ?? config.icons[i].iconColor
            }
        }
        config.default_values.iconName = getScreenElementValue(iconIDprefix + '-1+0') ?? config.default_values.iconName
        config.default_values.emoji = getScreenElementValue(iconIDprefix + '-1+1') ?? config.default_values.emoji
        config.default_values.iconColor = getScreenElementValue(iconIDprefix + '-1+2') ?? config.default_values.iconName
    }
}

function restoreTabScreenElements(tab_index){
    debugLog(['restoreTabScreenElements',tab_index])
    let tabID = getActiveTabID(tab_index)
    if (tabID === radioButtonsData_IDs.panel_colors){
        for (let i = 0;i < config.colors.length;i++){
            setScreenElementValue(colorIDprefix + i + '+1',standardize_color(config.colors[i].textColor))
            setScreenElementValue(colorIDprefix + i + '+2',standardize_color(config.colors[i].textBGColor))
        }
        setScreenElementValue(colorIDprefix + '-1+0',config.default_values.newFolder)
        setScreenElementValue(colorIDprefix + '-1+1',standardize_color(config.default_values.textColor))
        setScreenElementValue(colorIDprefix + '-1+2',standardize_color(config.default_values.textBGColor))
    } else if (tabID === radioButtonsData_IDs.panel_icons){
        for (let i = 0;i < config.icons.length;i++){
            setScreenElementValue(iconIDprefix + i + '+1',config.icons[i].iconText)
        }
        setScreenElementValue(iconIDprefix + '-1+0',config.default_values.iconName)
        setScreenElementValue(iconIDprefix + '-1+1',config.default_values.emoji)
    }
}


function saveOptions(cfg){
    browser.storage.local.set(cfg).then(onSaveConfigOK,onSaveConfigError)
}

function onFinishConfig(){
    draw_config_table(config)
}

function generate_color_config_table_line(colorz,idx){
    if (idx === null) {
        return `<tr>
                    <td>&nbsp;</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
               </tr>`
    }
    let i = str2int(idx)
    if (i === false){
        return false
    }
    if (idx === -1){
        let lastTextColor = standardize_color(config.default_values.textColor)
        let f_textColor
        if (ENABLE_TRANSPARENT_TEXTCOLOR && (lastTextColor === FAKE_TRANSPARENT_COLOR)){
            f_textColor =  standardize_color(TEXT_TRANSPARENT)
        } else {
            f_textColor =  standardize_color(lastTextColor)
        }
        let lastTextBGColor = standardize_color(config.default_values.textBGColor)
        let lastStyle = `color:${f_textColor};background-color:${lastTextBGColor};`
        let lastValue = config.default_values.newFolder
        let lastFolderEmoji = config.default_values.folderEmoji
        return `<tr id="${colorLineIDPrefix}-1" class="selector_row">
                       <td><input id="${colorIDprefix}-1+0" type="text" class="quick_search" placeholder="new folder name" value="${lastValue}" title="${tooltips.folderNameNew}" style="${lastStyle}" data-action="${cmdChangeColor}" data-id="-1"></td>
                       <td><input id="${colorIDprefix}-1+3" type="text" title="${tooltips.folderIconTextNew}" class="emoji" placeholder="emoji" value="${lastFolderEmoji}" data-action="${cmdChangeColor}" data-id="-1"></td>
                       <td><input id="${colorIDprefix}-1+1" type="color" title="${tooltips.textColorNew}" value="${lastTextColor}" data-action="${cmdChangeColor}" data-id="-1" ></td>
                       <td><input id="${colorIDprefix}-1+2" type="color" title="${tooltips.textBGColorNew}" value="${lastTextBGColor}" data-action="${cmdChangeColor}" data-id="-1" ></td>
                       <td><button title="${tooltips.folderAppendNew}" data-action="${cmdChangeColor}" data-id="-1">${emojiAppend}</button></td>
                  </tr>`
    } else {
        let folderName = colorz[i].folderName
        let folderEmoji = colorz[i].folderEmoji ?? ''
        let textColor = standardize_color(colorz[i].textColor)
        let f_textColor
        if (ENABLE_TRANSPARENT_TEXTCOLOR && (textColor === FAKE_TRANSPARENT_COLOR)){
            f_textColor =  standardize_color(TEXT_TRANSPARENT)
        } else {
            f_textColor =  standardize_color(textColor)
        }
        let textBGColor = standardize_color(colorz[i].textBGColor)
        let previewStyle = `color:${f_textColor};background-color:${textBGColor};` + generateFolderNamePreviewStyle(folderName,folderEmoji,textColor)
        let folderIconPlaceholder = generateFolderEmojiPlaceholder(folderName)
        return `<tr id="${colorLineIDPrefix}${i}">
                   <td><input id="${colorIDprefix}${i}+0" readonly="readonly" type="text" value="${folderName}" title="${tooltips.folderName}" style="${previewStyle}"></td>
                   <td><input id="${colorIDprefix}${i}+3" type="text" title="${tooltips.folderIconText}" class="emoji" placeholder="${folderIconPlaceholder}" value="${folderEmoji}" data-action="${cmdChangeColor}" data-id="${i}"></td>
                   <td><input id="${colorIDprefix}${i}+1" type="color" title="${tooltips.textColor}" value="${textColor}" data-action="${cmdChangeColor}" data-id="${i}" ></td>
                   <td><input id="${colorIDprefix}${i}+2" type="color" title="${tooltips.textBGColor}" value="${textBGColor}" data-action="${cmdChangeColor}" data-id="${i}" ></td>
                   <td><button title="${tooltips.textDelete}" data-action="${cmdRemoveColor}" data-id="${i}">${emojiDelete}</button></td>
              </tr>`
    }
}

function generate_color_config_table(colorz){
    colorz = sortColors(colorz)
    let rows = Array(0)
    let row
    let emptyRow = generate_color_config_table_line(colorz,null)
    let lastRow = generate_color_config_table_line(colorz,-1)
    if (TOP_SEARCH_BAR){
        rows = rows.concat(lastRow)
        rows = rows.concat(emptyRow)
    }

    for (let i = 0; i < colorz.length;i++){
        row = generate_color_config_table_line(colorz,i)
        rows = rows.concat(row)
    }
    if (!TOP_SEARCH_BAR){
        rows = rows.concat(emptyRow)
        rows = rows.concat(lastRow)
    }
    return rows.join('\n')
}
function generate_icon_config_table_line(iconz,idx){
    if (idx === null){
        return `<tr>
                    <td>&nbsp;</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
               </tr>`
    }
    let i = str2int(idx)
    if (i === false){
        return false
    }
    if (i === -1){
        let lastIconName = config.default_values.iconName
        let lastEmoji = config.default_values.emoji
        let lastColor = standardize_color(config.default_values.iconColor)
        let lastSaveButtonClass = "save_button_inactive" // todo...
        return `<tr id="${iconLineIDPrefix}-1" class="selector_row" >
                     <td><input id="${iconIDprefix}-1+0" type="text" title="${tooltips.iconNameNew}" class="icon_name_input quick_search" placeholder="new icon name" value="${lastIconName}" data-action="${cmdChangeIcon}" data-id="-1"></td>
                     <td><input id="${iconIDprefix}-1+1" type="text" title="${tooltips.iconTextNew}" class="emoji" placeholder="emoji" value="${lastEmoji}" data-action="${cmdChangeIcon}" data-id="-1"></td>
                     <td><input id="${iconIDprefix}-1+2" type="color" title="${tooltips.iconColorNew}" value="${lastColor}" data-action="${cmdChangeIcon}" data-id="-1" ></td>
                     <td><button id="${iconIDprefix}-1+3" class="${lastSaveButtonClass}" title="${tooltips.iconAppendNew}" data-action="${cmdChangeIcon}" data-id="-1">${emojiAppend}</button></td>
                     <td>&nbsp;</td>
                </tr>`
    } else {
        let iconName = iconz[i].iconName
        let iconText = iconz[i].iconText
        let iconColor = standardize_color(iconz[i].iconColor)
        let iconPlaceholder = find_emoji_placeholder(iconName,'?')
        let saveButtonClass = "save_button_inactive" // todo...
        let previewStyle = generateIconNamePreviewStyle(iconName,iconText,iconColor,true)
        return `<tr id="${iconLineIDPrefix}${i}">
                   <td><input style="${previewStyle}" id="${iconIDprefix}${i}+0" readonly="readonly" type="text" title="${tooltips.iconName}" value="${iconName}"></td>
                   <td><input id="${iconIDprefix}${i}+1" type="text" title="${tooltips.iconText}" class="emoji" placeholder="${iconPlaceholder}" value="${iconText}" data-action="${cmdChangeIcon}" data-id="${i}"></td>
                   <td><input id="${iconIDprefix}${i}+2" type="color" title="${tooltips.iconColor}" value="${iconColor}" data-action="${cmdChangeIcon}" data-id="${i}" ></td>
                   <td><button id="${iconIDprefix}${i}+3" class="${saveButtonClass}" title="${tooltips.iconSave}" data-action="${cmdChangeIcon}" data-id="${i}" >${emojiSave}</button></td>
                   <td><button title="${tooltips.iconDelete}" data-action="${cmdRemoveIcon}" data-id="${i}">${emojiDelete}</button></td>
                </tr>`
    }
}

function generate_icon_config_table(iconz){
    iconz = compactIcons(iconz)
    let rows = Array(0)
    let row
    let emptyRow = generate_icon_config_table_line(iconz,null)
    let lastRow = generate_icon_config_table_line(iconz,-1)
    if (TOP_SEARCH_BAR){
        rows = rows.concat(lastRow)
        rows = rows.concat(emptyRow)
    }
    for (let i = 0; i < iconz.length;i++){
        row = generate_icon_config_table_line(iconz,i)
        rows = rows.concat(row)
    }
    if (!TOP_SEARCH_BAR){
        rows = rows.concat(emptyRow)
        rows = rows.concat(lastRow)
    }
    return rows.join('\n')
}

function reset_config(){
    config = generate_default_config(config.misc.outlookLanguage)
}

function generate_public_config_JSON_text(cfg){
    cfg.colors = nullifyTransparentColors(cfg.colors)
    cfg.icons = nullifyTransparentIcons(cfg.icons)
    if (JSON_NULL_TO_TRANSPARENT){
        cfg.colors = transparentifyNullColors(cfg.colors)
        cfg.icons = transparentifyNullIcons(cfg.icons)
    }

    let out_cfg = {}
    let field_name
    for (let i = 0;i < config_field_names.length;i++){
        field_name = config_field_names[i]
        if (cfg.hasOwnProperty(field_name) && config_json_enabled_field_names.includes(field_name)){
            out_cfg[field_name] = cfg[field_name]
        }
    }
    return  JSON.stringify(out_cfg,null,2)
}

function generate_json_div(cfg){
    let json = generate_public_config_JSON_text(cfg)
    return `<div class="json_page_div">
                <div>
                    <textarea id="${loadJSONtextAreaID}" placeholder="json comes here" rows="20" >${json}</textarea>
                </div>
                <div>
                    <button class="single_button" data-action="${cmdLoadJSON}" data-id="-1" title="${tooltips.loadConfig}" >${emojiLoadFile}</button>
                    <button class="single_button" data-action="${cmdResetConfig}" data-id="-1" title="${tooltips.resetConfig}" >${emojiResetConfig}</button>
                    <button class="single_button" data-action="${cmdSwitchLanguage}" data-id="-1" title="${tooltips.switchLanguage}" >${emojiSwitchLang}</button>
                </div>                 
            </div>`
}

function generate_radiobuttons(active_tab){
    let rows = Array()
    let row
    let id
    let text
    let span_id
    let selected
    let cn
    for (let i = 0; i < radioButtonsData.length; i ++){
        id = radioButtonsData[i].id
        text = radioButtonsData[i].text
        span_id = radioButtonsData[i].radio_span_id
        if (i === active_tab){
            selected = 'checked'
            cn = 'radio-button-active-div'
        } else{
            selected = ''
            cn = 'radio-button-inactive-div'
        }
        row = `<span class="radio-button-common-div ${cn}" id="${span_id}"><input type="radio" id="${id}" name="${radioGroupName}" data-id="${i}" data-action="${cmdRadioButton}" value="${text}" ${selected}>
               <label title="${text}" for="${id}">${text}</label></span>`
        rows = rows.concat(row)
    }
    return rows.join(`${radioButtonsHTMLSeparator}\n`)
}

function loadConfigFromJSONtext(txt){
    let cfg = null
    try {
        cfg = JSON.parse(txt)
    } catch(e) {
        return false
    }
    let field_name
    for (let i = 0;i < config_field_names.length;i++) {
        field_name = config_field_names[i]
        if (cfg.hasOwnProperty(field_name) && config_json_enabled_field_names.includes(field_name)) {
            config[field_name] = cfg[field_name]
        }
    }
    if (JSONmergeWithDefaultIconNames){
        let db = iconNameDatabase()
        let history = {}
        let fieldName
        for (let i = 0;i<config.icons.length;i++){
            fieldName = config.icons[i]?.iconName ?? null
            if (!history.hasOwnProperty(fieldName)){
                history[fieldName] = true
            }
        }
        let newIcons = Object.keys(db).filter(item => !history.hasOwnProperty(item) ).map(item => ({iconName:item, iconText:'',iconColor:iconColor_JSONmerge_DEFAULT})  )
        config.icons = sortIcons(config.icons.concat(newIcons))
    }
    return true
}

function generate_help_div(){
    return `<div class="help_div">
                todo: help contents  
           </div>`
}

function generate_sandbox_div(){
    return `<div class="help_div">
                todo: SANDBOX  
           </div>`
}

function render_radio(cfg){
    debugLog(['render_radio - active_tab:',cfg.active_tab])
    let content = generate_radiobuttons(cfg.active_tab)
    return `
            <div id="${radiobuttonsDivID}">
                <div class="radio-button-panel" id = "${radiobuttonsDivCoreID}">
                    ${content}
                </div>
            </div>`
}

function render_color_config_table(cfg){
    let content = generate_color_config_table(cfg.colors)
    return `
            <div id="folder-painter-folder-options-div" class="colors_page_div">
                <table>
                    <thead>
                        <tr>
                            <th>Folder name</th>
                            <th>Emoji/PNG</th>
                            <th>Text color</th>
                            <th>Text BG</th>
                            <th>Add/Remove</th>
                        </tr>
                    </thead>
                    <tbody id="${colorTableBodyID}">
                        ${content}
                    </tbody>
                </table>
            </div>`
}

function render_icon_config_table(cfg){
    let content = generate_icon_config_table(cfg.icons)
    return `
            <div id="folder-painter-icon-options-div" class="icons_page_div">
                <table>
                    <thead>
                        <tr>
                            <th>data-icon-name</th>
                            <th>Emoji/PNG</th>
                            <th>Color</th>
                            <th>Add/Save</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody id="${iconTableBodyID}">
                        ${content}
                    </tbody>
                </table>
            </div>`
}

function render_json_div(cfg){
    let content = generate_json_div(cfg)
    return `
            <div id="folder-painter-json-options-div">
                <div id="${jsonDivCoreID}">
                    ${content}
                </div>
            </div>`
}

function render_help_div(){
    let content = generate_help_div()
    return `
            <div id="folder-painter-help-options-div">
                <div id="${helpDivCoreID}">
                    ${content}
                </div>
            </div>`
}

function render_sandbox_div(){
    let content = generate_sandbox_div()
    return `
            <div id="folder-painter-sandbox-div">
                <div id="${sandboxDivCoreID}">
                    ${content}
                </div>
            </div>`
}

function render(cfg){
    debugLog(['render - active_tab:',cfg.active_tab])
    let radio = render_radio(cfg)
    let content = 'error'
    let activePanelID = radioButtonsData[cfg.active_tab]?.id ?? radioButtonsData_IDs.error
    if (activePanelID === radioButtonsData_IDs.panel_colors){
        content = render_color_config_table(cfg)
    } else if (activePanelID === radioButtonsData_IDs.panel_icons){
        content = render_icon_config_table(cfg)
    } else if (activePanelID === radioButtonsData_IDs.panel_json){
        content = render_json_div(cfg)
    } else if (activePanelID === radioButtonsData_IDs.panel_help) {
        content = render_help_div()
    } else if (activePanelID === radioButtonsData_IDs.panel_sandbox){
        content = render_sandbox_div()
    } else {
        // error
    }
    return {radio:radio, panel:content}
}

function updateHTMLcontent(id,data,raw){
    let e = document.getElementById(id)
    if (raw){
        e.textContent = data
    } else{
        const parser = new DOMParser()
        const parsed = parser.parseFromString(data, `text/html`)
        const tags = parsed.getElementsByTagName(`body`)
        e.innerHTML = ``
        for (const tag of tags) {
            e.appendChild(tag)
        }
    }
}

function draw_config_table(cfg){
    const data = render(cfg)

    updateHTMLcontent(contentDivIDs.radio.id,data.radio,contentDivIDs.radio.raw)
    updateHTMLcontent(contentDivIDs.panel.id,data.panel,contentDivIDs.panel.raw)

    filterVisibleColors(config.default_values.newFolder)
    filterVisibleIcons(config.default_values.iconName)
}

function confirmation(question){
    return window.confirm(question)
}

function iconChanged(id){
    let idx = str2int(id)
    if (idx !== false) {
        if (idx === -1) {
            return true
        } else if (0 <= idx && idx < config.icons.length){
            let oldEmoji = config.icons[idx].iconText
            let newEmoji = document.getElementById(iconIDprefix + id + '+1').value
            let oldIconColor = standardize_color(config.icons[idx].iconColor)
            let newIconColor = standardize_color(document.getElementById(iconIDprefix + id + '+2').value)
            let changed = (oldEmoji !== newEmoji) || (oldIconColor !== newIconColor)
            debugLog(['iconChanged',changed,oldEmoji,oldIconColor,'->',newEmoji,newIconColor])
            return changed
        }
    }
    return false
}

function colorChanged(id){
    let idx = str2int(id)
    if (idx !== false) {
        if (idx === -1) {
            return true
        } else if (0 <= idx && idx < config.colors.length){
            let oldTextColor = standardize_color(config.colors[idx].textColor)
            let newTextColor = standardize_color(document.getElementById(colorIDprefix + id + '+1').value)

            let oldTextBGColor = standardize_color(config.colors[idx].textBGColor)
            let newTextBGColor = standardize_color(document.getElementById(colorIDprefix + id + '+2').value)

            let changed = (newTextColor !== oldTextColor) || (newTextBGColor !== oldTextBGColor)
            debugLog(['colorChanged',changed,oldTextColor,oldTextBGColor,'->',newTextColor,newTextBGColor])
            return changed
        }
    }
    return false
}

function modify_inputIconPreviewStyle(id){
    let idx = str2int(id)
    //debugLog(['modify_inputIconPreviewStyle',idx])
    if (idx === false || idx < 0) {
        return false
    }
    let elem_id = `${iconIDprefix}${idx}+0`
    let elem = document.getElementById(elem_id)
    if (elem){
        let iconName = getScreenElementValue(`${iconIDprefix}${idx}+0`) ?? 'unknown'
        let emoji = getScreenElementValue(`${iconIDprefix}${idx}+1`) ?? ':-('
        let color = getScreenElementValue(`${iconIDprefix}${idx}+2`) ?? 'cyan'
        elem.style = generateIconNamePreviewStyle(iconName, emoji, color, true)
    }
}

function modify_inputIcon(id){
    modify_inputIconPreviewStyle(id)
    modify_iconSaveButtonClass(id)
}

function modify_iconSaveButtonClass(id){
    let idx = str2int(id)
    if (idx === false){
        return false
    }
    let elem = document.getElementById(iconIDprefix + id + '+3')
    if (elem){
        if (idx === -1){
           // todo
        } else {
            let c_value = config.icons[idx].iconText
            let g_value = getScreenElementValue(iconIDprefix + idx + '+1')

            let c_color = standardize_color(config.icons[idx].iconColor)
            let g_color = standardize_color(getScreenElementValue(iconIDprefix + idx + '+2'))

            elem.className = ((c_value !== g_value) || (g_color !== c_color) ? 'save_button_active' : 'save_button_inactive')
        }
    }
}

function changeTableRowVisibility(id,visible){
    let elem = document.getElementById(id)
    if (elem){
        elem.style.display = (visible ? 'table-row' : 'none')
    }
}

function filterVisibleIcons(filterText){
    let iconName
    let visible
    let id
    let bigFilterText = filterText.toUpperCase()
    for (let i = 0; i<config.icons.length;i++){
        iconName = config.icons[i].iconName.toUpperCase()
        visible = (filterText === '') || iconName.includes(bigFilterText)
        id =`${iconLineIDPrefix}${i}`
        changeTableRowVisibility(id,visible)
    }
}

function filterVisibleColors(filterText){
    let folderName
    let visible
    let id
    let bigFilterText = filterText.toUpperCase()
    for (let i = 0; i < config.colors.length;i++){
        folderName = config.colors[i].folderName.toUpperCase()
        visible = (filterText === '') || folderName.includes(bigFilterText)
        id =`${colorLineIDPrefix}${i}`
        changeTableRowVisibility(id,visible)
    }
}

function handleKeyDown(e){
    let control_type = e.target.tagName.toLowerCase()
    let action = e.target.getAttribute('data-action')
    let id = e.target.getAttribute('data-id')
    debugLog(['handleKeyDown',e.key,e.keyCode,e.code,control_type,action,id])
    if (e.key === "Enter"){ // key:"Enter", keyCode:13
        if (control_type === 'input'){
            if (action === cmdChangeColor){
                let idx = str2int(id)
                if ((idx !== false) && (0 <= idx)){ // a -1-hez van külön mentés gomb!
                    processButtonClick(action,id)
                    let e = document.getElementById(formID)
                    e.submit()
                    return
                }
            }
            e.preventDefault()
        }else if (control_type !== 'button'){
            debugLog(['handleKeyDown - enter disabled',e.key,e.keyCode,e.code,control_type,action,id])
            e.preventDefault()  // preventing submit form when pressing enter on elements
        }
    }
}

function handleKeyUp(e){
    let control_type = e.target.tagName.toLowerCase()
    let action = e.target.getAttribute('data-action')
    let id = e.target.getAttribute('data-id')
    debugLog(['handleKeyUp',e.key,e.code,control_type,action,id])
    if (control_type === 'input') {
        if (action === cmdChangeColor){
            if (id === '-1'){
                let filter = document.getElementById(colorIDprefix + id + '+0').value
                config.default_values.newFolder = filter
                filterVisibleColors(filter)
            }
        } else if (action === cmdChangeIcon){
            if (id === '-1'){
                let filter = document.getElementById(iconIDprefix + id + '+0').value
                filterVisibleIcons(filter)
            }
        } else {
            debugLog(['handleKeyUp - "input" unhandled action',e.target.id,control_type,action,id])
        }
    } else {
        debugLog(['handleKeyUp - unhandled control type',e.target.id,control_type,action,id])
    }
}

function modify_inputColor(id){
    let idx = str2int(id)
    debugLog(['modify_inputColor',idx])
    if (idx === false) {
        return false
    }
    let elem_id = `${colorIDprefix}${idx}+0`
    let elem = document.getElementById(elem_id)
    if (elem){
        let newcolor = getScreenElementValue(`${colorIDprefix}${idx}+1`) ?? 'ff0011'
        let newBGcolor = getScreenElementValue(`${colorIDprefix}${idx}+2`) ?? '00ff22'
        elem.style.color = newcolor
        elem.style.backgroundColor = newBGcolor
    }
}

function handleChange(e){
    let control_type = e.target.tagName.toLowerCase()
    let action = e.target.getAttribute('data-action')
    let id = e.target.getAttribute('data-id')
    debugLog(['handleChange',e.target.id,control_type,action,id])
    if (control_type === 'input') {
        if (action === cmdChangeColor){
            if (colorChanged(id)) {
                if (id === '-1') {
                    action = cmdChangeColorNoSave
                }
                modify_inputColor(id)
                processButtonClick(action, id)
            }
        } else if (action === cmdChangeIcon){
            if (iconChanged(id)){
                if (id === '-1') {
                    action = cmdChangeIconNoSave
                }
            }
            modify_inputIcon(id)
            processButtonClick(action, id)
        } else {
            debugLog(['handleChange - "input" unhandled action',e.target.id,control_type,action,id])
        }
    }
    else {
        debugLog(['handleChange - unhandled control type',e.target.id,control_type,action,id])
    }
}

function handleClick(e){
    let control_type = e.target.tagName.toLowerCase()
    let action = e.target.getAttribute('data-action')
    let id = e.target.getAttribute('data-id')
    debugLog(['handleClick',e.target.id,control_type,action,id])

    if (control_type === 'button') {
        processButtonClick(action,id)
    } else if (control_type === 'input') {
        if (action === cmdRadioButton) {
            processButtonClick(action,id)
        } else {
            debugLog(['handleClick - Control type: ', control_type,'invalid action/id:',action,id])
        }
    } else{
        debugLog(['handleClick - unhandled control type: ', control_type])
    }
}

function processButtonClick(action,id){
    if (action === null && id === null){
        return false
    }
    let idx = str2int(id)
    debugLog(['processButtonClick',action,id,idx])
    if (idx === false) {
        return false
    }
    if (action === cmdChangeIconNoSave){
        if (id === '-1') {
            config.default_values.iconName = document.getElementById(iconIDprefix + id + '+0').value
            config.default_values.emoji = document.getElementById(iconIDprefix + id + '+1').value
            config.default_values.iconColor = document.getElementById(iconIDprefix + id + '+2').value
        } else {
            return false
        }
    } else if (action === cmdChangeColorNoSave){
        if (id === '-1') {
            config.default_values.newFolder = document.getElementById(colorIDprefix + id + '+0').value
            config.default_values.textColor = document.getElementById(colorIDprefix + id + '+1').value
            config.default_values.textBGColor = document.getElementById(colorIDprefix + id + '+2').value
            config.default_values.folderEmoji = document.getElementById(colorIDprefix + id + '+3').value
        } else {
            return false
        }
    } else if (action === cmdRemoveColor) {
        // remove color item
        config.colors = config.colors.filter(
            (item,index) => {return (index !== idx)}
        )
    } else if (action === cmdChangeColor) {
        if (id === '-1') {
            // we can add multiple texts (with the same color), separated by 'colorListSeparator' (;)
            let newFolderNames = document.getElementById(colorIDprefix + id + '+0').value.split(colorListSeparator)
            let newTextColor = document.getElementById(colorIDprefix + id + '+1').value
            let newTextBGColor = document.getElementById(colorIDprefix + id + '+2').value
            let newFolderEmoji = document.getElementById(colorIDprefix + id + '+3').value
            for (let j = 0; j < newFolderNames.length; j++) {
                config.colors = config.colors.concat(
                    {
                        folderName: newFolderNames[j],
                        textColor: newTextColor,
                        textBGColor: newTextBGColor,
                        folderEmoji: newFolderEmoji
                    }
                )
            }
            config.default_values.newFolder = ''
            config.default_values.textColor = newTextColor
            config.default_values.textBGColor = newTextBGColor
            config.default_values.folderEmoji = newFolderEmoji
        } else {
            // modify color item
            config.colors[idx] = {
                folderName: config.colors[idx].folderName,
                textColor: document.getElementById(colorIDprefix + id + '+1').value,
                textBGColor: document.getElementById(colorIDprefix + id + '+2').value,
                folderEmoji: document.getElementById(colorIDprefix + id + '+3').value
            }
        }
        //processButtonClick(cmdRadioButton,config.active_tab.toString())
    } else if (action === cmdRemoveIcon) {
        // remove icon item
        config.icons = config.icons.filter(
            (item,index) => {return (index !== idx)}
        )
    } else if (action === cmdChangeIcon) {
        if (id === '-1') {
            let newIconName = document.getElementById(iconIDprefix + id + '+0').value
            let newIconText = document.getElementById(iconIDprefix + id + '+1').value
            let newIconColor = document.getElementById(iconIDprefix + id + '+2').value
            config.icons = config.icons.concat( {iconName: newIconName, iconText: newIconText,iconColor: newIconColor} )
            config.default_values.iconName = newIconName
            config.default_values.emoji = newIconText
        } else {
            // modify icon item
            config.icons[idx] = {
                iconName: config.icons[idx].iconName,
                iconText: document.getElementById(iconIDprefix + id + '+1').value,
                iconColor: document.getElementById(iconIDprefix + id + '+2').value
            }
        }
        //processButtonClick(cmdRadioButton,config.active_tab.toString())
    } else if (action === cmdRadioButton) {
        saveTabScreenElements(config.active_tab)
        config.active_tab = idx
        draw_config_table(config)
    } else if (action === cmdLoadJSON) {
        let txt = document.getElementById(loadJSONtextAreaID).value
        let ok = loadConfigFromJSONtext(txt)
        if (!ok) {
            return false
        }
    } else if (action === cmdResetConfig){
        if (confirmation(questionResetConfig)){
            reset_config()
        }
    } else if (action === cmdSwitchLanguage) {
        switchNextLanguage()
    } else {
        // invalid action
        debugLog(['processButtonClick - invalid action:',action,id])
        return false
    }
    config.icons = nullifyTransparentIcons(normalizeIcons(sortIcons(compactIcons(config.icons.reverse()))))
    config.colors = nullifyTransparentColors(normalizeColors(sortColors(compactColors(config.colors.reverse()))))
    saveOptions(config)
    return true
}


document.addEventListener("DOMContentLoaded", restoreOptions)
document.querySelector("form").addEventListener('click', handleClick,false)
document.querySelector("form").addEventListener('change', handleChange,false)
document.querySelector("form").addEventListener('keyup', handleKeyUp,false)
document.querySelector("form").addEventListener('keydown', handleKeyDown,false)
