const DEBUG_COLLECT_ICONS = false   // homemade stuff for collecting dataIconNames
const FORCE_RESET_CONFIG = false    // for recreating config settings
const DEBUG_LOG_MODE_LOG = false    // debug messages to console - Warning: console log disabled on Mozilla config page!
const DEBUG_LOG_MODE_ALERT = false  // show debug messages as alert() messages
const DEBUG_SHOW_RAW_CONTENT = false // show panels' content as text instead of html
const JSON_NULL_TO_TRANSPARENT = true // JSON export: replace 'transparent' colors to null
const ENABLE_TRANSPARENT_TEXTCOLOR = false // transparent text colors enabled?
const TOP_SEARCH_BAR = true // draw searchbar on the top of the table or to the bottom?


const FAKE_TRANSPARENT_COLOR = '#ffffff'    // this color means transparent
const LANG_CODE = 'en'  // only used for creating default directory colors - en/hu
const TEXT_TRANSPARENT = 'transparent'
const icon_valid_fields = ['iconName','iconText','iconColor']
const icon_color_fields = ['color']
const color_valid_fields = ['folderName','textColor','textBGColor']
const color_color_fields = {all: ['textColor','textBGColor'],
                            fg: ['textColor'],
                            bg:  ['textBGColor']}

const config_field_names = ['colors','icons','active_tab','enabled','outlook_language','default_values']
const config_json_enabled_field_names = ['colors','icons','outlook_language']
//const lang_codes = {en:'en',hu:'hu'}
const iconColor_DEFAULT = 'blue' // color of the unchanged i[data-icon-name] elements
const iconColor_DEBUG_DEFAULT = 'green' // ?????
const FORCE_HIDE_ORIGINAL_ICONS = true // mindenképp rejtse el az eredeti ikonokat - egyébként figyelni kell, hogy transparent-re állítsuk
const icon_WIDTH = 16
const ioon_RIGHT_PADDING = 8 // NULL ESETÉN CENTER (új módszernál)
const OLD_ICON_MODE = true  // Sajnos az új módszer nem vált be

const MIN_PNG_DATA_LENGTH = 32
const ENABLE_TXT2IMAGE_INLINE = false // Az emojik-ból is képet generáljon-e (az új módszernél ha kikapcsoljuk, nem jelenik meg semmi)
const FONTSIZE_TXT2IMAGE = 85
const FONTS_EMOJI = 'Segoe UI Emoji'
const FONTS_TXT2IMAGE = `controlIcons, mailIcons, peopleIcons, ${FONTS_EMOJI}`
const USE_BOLD_FONT = false
const USE_ITALIC_FONT = false
const CTX_WIDTH = 128
const ERROR_IMAGE = text2image('error','red',16)
const DEBUG_DISABLE_sanitize_base64 = false // TESZTELÉSHEZ -> YQ==);border:33px solid red;background-image: url("paper.gif"
const COPY_PLACEHOLDERS = false // icon reset esetén a placeholderek átmásolása az iconText mezőkbe?

let config = generate_default_config(LANG_CODE)

function generate_default_config(language_code){
    return {
        icons: make_default_icons(),
        colors: make_default_colors(language_code),
        active_tab : 1,
        outlook_language : language_code,
        enabled : {colors:true, icons: !OLD_ICON_MODE, icons_OLD: OLD_ICON_MODE, redNumbers : true},
        default_values : {newFolder : '', textColor : 'blue', textBGColor: TEXT_TRANSPARENT, iconName : '', emoji : '', iconColor: iconColor_DEFAULT}
    }
}


function iconNameDatabase(){
  return  {
      Add: '\ue710',
      AddEvent: '\ueeb5',
      AddFavorite: '\uf0c8',
      AddFriend: '\ue8fa',
      AddIn: '\uf775',  // no preview (invalid char?)
      Archive: '\uf03f',
      Attach: '\ue723',
      Blocked: '\ue733',
      BoxLogo: '\ued75',
      Broom: '\uea99',
      Calendar: '\ue787',
      Camera: '\ue722',
      Cancel: '\ue711',
      Chat: '\ue901',
      ChevronDown: '\ue70d',
      ChevronDownMed: '\ue972',
      ChevronRight: '\ue76c',
      ChevronRightMed: '\ue974',
      CircleFill: '\uea3b',
      CircleRing: '\uea3a',
      Clock: '\ue917',
      ClosePane: '\ue89f',
      CollapseContent: '',
      CommentUrgent: '\uf307',
      ComposeRegular: '[/]',// svg:pencil in a square
      Contact: '\ue77b',
      ContactList: '\uf7e5',
      Copy: '\ue8c8',
      Delete: '\ue74d',
      Down: '\ue74b',
      DropboxLogo: '\ued77',
      Edit: '\ue70f',
      EgnyteLogo: '\uf373',
      EmojiTabSymbols: '\ued58',
      EndPointSolid: '\ueb4b',
      ExploreContent: '\ueccd',
      FabricFolder: '\uf0a9',
      FabricMovetoFolder: '\uf0a5',
      FabricUserFolder: '\uf5e5',
      FavoriteStarFill: '\ue735',
      Filter: '\ue71c',
      Flag: '\ue7c1',
      Forward: '\ue72a',
      FullScreen: '\ue740',
      GlobalNavButton: '\ue700',
      GotoToday: '\ue8d1',
      Important: '\ue8c9',
      Inbox: '\uf41c',
      Info: '\ue946',
      Like: '\ue8e1',
      LikeSolid: '\uf3bf',
      LinkedInLogo: '\uf20a',
      List: '\uea37',
      Mail: '\ue715',
      MicrosoftTranslatorLogo: '\uf782',
      MiniExpandMirrored: '\uea5a',
      More: '\ue712',
      MoreVertical: '\uf2bc',
      NotePinned: '\ued9a',
      OfficeChat: '\uf70f',
      Page: '\ue7c3',
      People: '\ue716',
      Phone: '\ue717',
      Photo2: '\ueb9f',
      Pin: '\ue718',
      PinnedSolid: '\uf676',
      Play: '\ue768',
      PlayerSettings: '\uef58',
      POI: '\uecaf',
      Print: '\ue749',
      QuickNote: '\ue70b',
      Read: '\ue8c3',
      RecruitmentManagement: '\uee12',
      ReminderGroup: '\uebf8',
      RemoveFromTrash: '\uf82b',
      Reply: '\ue97a',
      ReplyAll: '\uee0a',
      RevToggleKey: '\ue845',
      Search: '\ue721',
      Send: '\ue724',
      Settings: '\ue713',
      Share: '\ue72d',
      SortDown: '\uee69',
      StarFilled: '\u2605', // svg: filled star
      StatusCircleCheckmark: '\uf13e',
      Tag: '\ue8ec',
      TagSolid: '\uf70e',
      ToDoLogoOutline: '\uf75b',
      Undo: '\ue7a7',
      Up: '\ue74a',
      Video: '\ue714'
  }
}

function debugLog(v){
    if (DEBUG_LOG_MODE_LOG || DEBUG_LOG_MODE_ALERT){
        let txt = JSON.stringify(v)
        if (DEBUG_LOG_MODE_LOG){
            console.log(txt)
        }
        if (DEBUG_LOG_MODE_ALERT){
            alert(txt)
        }
    }
}

function debugAlert(v){ // USE ONLY IN DEVELOPMENT!
    let txt = JSON.stringify(v)
    alert(txt)
}

function JSONAlert(v){
    let txt = JSON.stringify(v)
    alert(txt)
}


function make_default_icons(){
    const emojis = {
        Inbox: '📮',
        Edit: '✏',
        Send: '📯',
        Delete: '🗑',
        Blocked: '💩',
        Archive: '🏴‍☠',
        QuickNote: '🧾',
        FabricFolder: '📭',
        ChevronRightMed: '👉',
        ChevronDownMed: '👇'}
    let db = iconNameDatabase()
    return Object.keys(db).map(key =>
        {
            return {iconName:key, iconText: (emojis.hasOwnProperty(key) ? emojis[key] : (COPY_PLACEHOLDERS ? find_emoji_placeholder(key,'') : '') ), iconColor : iconColor_DEFAULT  }
        } )
}


function find_emoji_placeholder(dataIconName,defaultResult){
    let db = iconNameDatabase()
    if (db.hasOwnProperty(dataIconName)){
        return db[dataIconName]
    } else {
        return defaultResult
    }
}


function make_default_colors(lang){
    const default_colors = {
        en : [
            ['Inbox', '#004753'],
            ['Drafts', '#004753'],
            ['Sent Items', '#004753'],
            ['Deleted Items', 'teal'],
            ['Junk Email', 'brown'],
            ['Archive', 'blue'],
            ['Notes', 'blue'],
            ['Conversation History', '#5e5eac'],
            ['Favorites', 'green']
        ],
        hu : [
            ['Beérkezett üzenetek', '#004753'],
            ['Piszkozatok', '#004753'],
            ['Elküldött elemek', '#004753'],
            ['Törölt elemek', 'teal'],
            ['Levélszemét', 'brown'],
            ['Archívum', 'blue'],
            ['Feljegyzések', 'blue'],
            ['Beszélgetési előzmények', '#5e5eac'],
            ['Kedvencek', 'green']
        ]
    }
    let lang_code
    if (!default_colors.hasOwnProperty(lang)){
        lang_code = Object.keys(default_colors)[0]
        debugLog(['lang modified:',lang,lang_code])
    } else {
        lang_code = lang
    }
    return default_colors[lang_code].map(item => ({folderName:item[0], textColor:item[1], textBGColor: TEXT_TRANSPARENT}) )
}

function standardize_color(str){
    if (str === null){
        return FAKE_TRANSPARENT_COLOR
    }
    if (str.toLowerCase() === TEXT_TRANSPARENT){
        return FAKE_TRANSPARENT_COLOR
    }

    let ctx = document.createElement("canvas").getContext("2d");
    ctx.fillStyle = str;
    return ctx.fillStyle;
}

function onLoadConfigOK(data){
    debugLog(['onLoadConfigOK',data])
    let field_name
    let loaded_field
    for (let i = 0;i < config_field_names.length;i++){
        field_name = config_field_names[i]
        if (data.hasOwnProperty(field_name)){
            loaded_field = data[field_name]
            if (FORCE_RESET_CONFIG) {
                //
            } else {
                config[field_name] = loaded_field
            }
        } else {
            debugLog(['missing field:',field_name])
        }
    }
}

function onLoadConfigError(error){
    debugLog(['onLoadConfigError',error])
}


function onSaveConfigOK(data){
    debugLog(['onSaveConfigOK',data])
}

function onSaveConfigError(error){
    debugLog(['onSaveConfigError',error])
}

function str2int(s){
    let i = parseInt(s,10)
    if (isNaN(i)){
        return false
    } else {
        return i
    }
}

function sortColors(colors){
    return colors.sort( ( a , b) => a.folderName.localeCompare(b.folderName)  )
}

function normalizeArray(arr,valid_fields){
    let result = Array()
    let item
    let new_item
    let field
    for(let i = 0;i < arr.length;i++){
        item = arr[i]
        new_item = {}
        for (let j = 0;j < valid_fields.length;j++){
            field = valid_fields[j]
            new_item[field] = item[field] ?? null
        }
        result = result.concat(new_item)
    }
    return result
}

function replaceArrayValues(arr,fromWhat,toWhat,color_field_names){
    let result = Array()
    let item
    let field_name
    for(let i = 0;i < arr.length;i++){
        item = arr[i]
        for (let j = 0;j < color_field_names.length;j++){
            field_name = color_field_names[j]
            if (item.hasOwnProperty(field_name)){
                if (item[field_name] === fromWhat) {
                    item[field_name] = toWhat
                }
            }
        }
        result = result.concat(item)
    }
    return result
}


function nullifyTransparentColors(colors){
    if (ENABLE_TRANSPARENT_TEXTCOLOR){
        let temp = replaceArrayValues(colors,FAKE_TRANSPARENT_COLOR,null,color_color_fields.all)
        return replaceArrayValues(temp,TEXT_TRANSPARENT,null,color_color_fields.all)
    } else {
        let temp1 = replaceArrayValues(colors,FAKE_TRANSPARENT_COLOR,null,color_color_fields.bg)
        let temp2 = replaceArrayValues(temp1,TEXT_TRANSPARENT,null,color_color_fields.bg)
        return replaceArrayValues(temp2,TEXT_TRANSPARENT,FAKE_TRANSPARENT_COLOR,color_color_fields.fg)

    }
}

function nullifyTransparentIcons(icons){
    return replaceArrayValues(icons,FAKE_TRANSPARENT_COLOR,null,icon_color_fields)
}

function transparentifyNullColors(colors){
    if (ENABLE_TRANSPARENT_TEXTCOLOR){
        return replaceArrayValues(colors,null,TEXT_TRANSPARENT,color_color_fields.all)
    } else{
        let temp = replaceArrayValues(colors,null,TEXT_TRANSPARENT,color_color_fields.bg)
        return replaceArrayValues(temp,null,FAKE_TRANSPARENT_COLOR,color_color_fields.fg)
    }
}

function transparentifyNullIcons(icons){
    return replaceArrayValues(icons,null,TEXT_TRANSPARENT,icon_color_fields)
}


function normalizeColors(colors){
    return  normalizeArray(colors,color_valid_fields)
}

function normalizeIcons(icons){
    return normalizeArray(icons,icon_valid_fields)
}

function compactColors(colors){
    let seen = {}
    return colors.filter(item => {
        if (item.folderName === ''){
            return false
        }
        if (seen.hasOwnProperty(item.folderName)) {
            debugLog(['compactColors - removed:',item])
            return false
        } else {
            seen[item.folderName] = true
            return true
        }
    })
}

function sortIcons(icons){
    return icons.sort( (a,b) => a.iconName.localeCompare(b.iconName) )
}

function compactIcons(icons){
    let seen = {}
    return icons.filter(item => {
        if (item.iconName === ''){
            return false
        }
        if (seen.hasOwnProperty(item.iconName)) {
            debugLog(['compactIcons - removed:',item])
            return false
        } else {
            seen[item.iconName] = true
            return true
        }
    })
}

function iconCollector(importants){
    let inputs = document.getElementsByTagName('i')
    let found = Array()
    let iconName
    let hint
    let existing_hint
    let new_item
    let defaulthintvalue = '???'
    let important

    for(let i = 0; i < inputs.length; i++) {
        iconName = inputs[i].dataset.iconName
        hint = inputs[i].innerText
        important = importants.includes(iconName)
        if (important || hint !== ''){
            existing_hint = find_emoji_placeholder(iconName,defaulthintvalue)
            if (important || existing_hint === defaulthintvalue || existing_hint === ''){
                new_item = {iconName:iconName, iconText:hint, important: important}
                found = found.concat(new_item)
            }
        }
    }
    return compactIcons(found)
    //return found
}

function sanitize_base64(data){
    if (DEBUG_DISABLE_sanitize_base64){
        return data
    }
    try {
        let raw = atob(data)
    } catch(e) {
        return false
    }
    return data
}

function generateIconStyleX(iconName,pngBase64,color,enableText2image){
    let img_width = icon_WIDTH
    let i_color = color ?? iconColor_DEBUG_DEFAULT
    let draw_color = color ?? iconColor_DEFAULT
    let bg_img_code = null
    let st0
    let code = pngBase64 ?? ''

    if (code === ''){
        st0 = ''
    } else if (code.length < MIN_PNG_DATA_LENGTH){
        if (enableText2image){
            let draw_color = color ?? iconColor_DEFAULT
            let xcode = text2image(pngBase64,draw_color,img_width)
            bg_img_code = `url(${xcode})`
        } else {
            let foFa
            if (FONTS_TXT2IMAGE){
                foFa = FONTS_TXT2IMAGE
            } else {
                foFa = FONTS_EMOJI
            }
            st0 = `color:${draw_color}; font-family:${foFa}; content:"${pngBase64}";`
        }
    } else {
        pngBase64 = sanitize_base64(pngBase64)
        if (pngBase64 === false){
            bg_img_code = `url(${ERROR_IMAGE})`
        } else {
            bg_img_code = `url(data:image/png;base64,${pngBase64})`
        }
    }
    if (bg_img_code !== null){
        i_color = iconColor_DEBUG_DEFAULT
        st0 = `content: ${bg_img_code};`
    }
    i_color = i_color ?? TEXT_TRANSPARENT
    if (i_color === FAKE_TRANSPARENT_COLOR){
        i_color = TEXT_TRANSPARENT
    }
    if (st0 !== '' && FORCE_HIDE_ORIGINAL_ICONS){
        i_color = TEXT_TRANSPARENT
    }
    let st1 = `color:${i_color} !important;`
    if (st0 !== ''){
        st1 += `margin-right:-12px;`
    }
    return {before: st0, element: st1}
}

function generateIconStyle(iconName,pngBase64,color,enableText2image){
    let img_width = icon_WIDTH
    let min_width = img_width
    let i_color = color ?? iconColor_DEBUG_DEFAULT
    let bg_img_code = null
    let code = pngBase64 ?? ''
    if (0 < code.length) {
        if (code.length < MIN_PNG_DATA_LENGTH){
            if (enableText2image){
                let draw_color = color ?? iconColor_DEFAULT
                let xcode = text2image(pngBase64,draw_color,img_width)
                bg_img_code = `url(${xcode})`
            }
        } else {
            pngBase64 = sanitize_base64(pngBase64)
            if (pngBase64 === false){
                bg_img_code = `url(${ERROR_IMAGE})`
            } else {
                bg_img_code = `url(data:image/png;base64,${pngBase64})`
            }
        }
    }
    let attributes = Array()
    if (bg_img_code !== null){
        i_color = iconColor_DEBUG_DEFAULT
    }
    i_color = i_color ?? TEXT_TRANSPARENT
    attributes = attributes.concat(`color:${i_color} !important;`)
    if (bg_img_code !== null){
        let xval
        if (ioon_RIGHT_PADDING === null){
            xval = 'center'
        } else{
            xval = `right ${ioon_RIGHT_PADDING}px`
            min_width += ioon_RIGHT_PADDING
        }
        attributes = attributes.concat(
            [`background-image: ${bg_img_code};`,
            `min-width:${min_width}px !important;`,
            `min-height:${img_width}px !important;`,
            'background-repeat: no-repeat;',
            `background-position-x: ${xval} !important;`,
            'background-position-y: center;',
            'background-size: auto;'
             //`background-size: ${img_width}px ${img_width}px;`
            ])
    }
    return attributes.join('\n')
}

function generateIconNamePreviewStyle(iconName,txt_or_pngBase64,color){
    color = color ?? iconColor_DEFAULT ?? iconColor_PREVIEW_DEFAULT
    let clr = standardize_color(color)
    let size = 16
    let delta = 5
    let pad = size + 2 * delta
    let img
    if (txt_or_pngBase64 === null || txt_or_pngBase64 === ''){
        img = text2image(find_emoji_placeholder(iconName),clr,size)
    } else {
        if (txt_or_pngBase64.length < MIN_PNG_DATA_LENGTH){
            img = text2image(txt_or_pngBase64,clr,size)
        } else {
            txt_or_pngBase64 = sanitize_base64(txt_or_pngBase64)
            if (txt_or_pngBase64 === false){
                img = ERROR_IMAGE
            } else {
                img = `data:image/png;base64,${txt_or_pngBase64}`
            }
        }
    }
    let bgposx = `right ${delta}px`
    return `background-image: url(${img});
            background-repeat: no-repeat;
            background-position-x: ${bgposx};
            background-position-y: center;
            background-size: ${size}px ${size}px;
            padding-right: ${pad}px;`
}


function text2image(txt,color,size){
    let canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    let ctx = canvas.getContext('2d')
    ctx.font =  (USE_BOLD_FONT ? 'bold ' : '') +  (USE_ITALIC_FONT ? 'italic ' : '') + `${FONTSIZE_TXT2IMAGE}px ${FONTS_TXT2IMAGE}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = color ?? iconColor_DEFAULT
    ctx.scale(size/CTX_WIDTH,size/CTX_WIDTH)
    ctx.fillText(txt ?? '??',CTX_WIDTH/2,CTX_WIDTH/2,CTX_WIDTH)
    return canvas.toDataURL()
}