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
const color_valid_fields = ['folderName','textColor','textBGColor','folderEmoji']
const color_color_fields = {all: ['textColor','textBGColor'],
                            fg: ['textColor'],
                            bg:  ['textBGColor']}

const config_field_names = ['icons','colors','enabled','misc', 'default_values','active_tab','config_version']
const config_json_enabled_field_names = ['colors','icons','enabled','misc']
const lang_codes = ['en','hu']
const iconColor_DEFAULT = 'blue' // color of the unchanged i[data-icon-name] elements
const iconColor_DEBUG_DEFAULT = 'green' // ?????
const FORCE_HIDE_ORIGINAL_ICONS = true // mindenképp rejtse el az eredeti ikonokat - egyébként figyelni kell, hogy transparent-re állítsuk
const icon_WIDTH = 16
const ioon_RIGHT_PADDING = 8 // NULL ESETÉN CENTER (új módszernál)

const JSONmergeWithDefaultIconNames = true
const iconColor_JSONmerge_DEFAULT = 'purple' // hogy lássuk a különbséget
const OLD_CODES = false

const sz_FABRIC_FOLDER = OLD_CODES ? 'FabricFolder' : 'FolderRegular'
const MIN_PNG_DATA_LENGTH = 32
const ENABLE_TXT2IMAGE_INLINE = false // Az emojik-ból is képet generáljon-e (az új módszernél ha kikapcsoljuk, nem jelenik meg semmi)
const FONTSIZE_TXT2IMAGE = 85
const FONTS_EMOJI = 'Segoe UI Emoji'
const FONTS_TXT2IMAGE = `controlIcons, mailIcons, peopleIcons, addinsIcons, surfaceActionIcons, ${FONTS_EMOJI}`
const USE_BOLD_FONT = false
const USE_ITALIC_FONT = false
const CTX_WIDTH = 128
const ERROR_IMAGE = text2image('error','red',16)
const DEBUG_DISABLE_sanitize_base64 = false // TESZTELÉSHEZ -> YQ==);border:33px solid red;background-image: url("paper.gif"
const COPY_PLACEHOLDERS = false // icon reset esetén a placeholderek átmásolása az iconText mezőkbe?
const CONFIG_VERSION = '0.8.7'
let config = generate_default_config(LANG_CODE) // ez az egyetlen globális változó, amely módosítható!
const commonFoldersDatabase = generateCommonFoldersDatabase()

function generate_default_config(languageCode){
    languageCode = languageCode.toLowerCase()
    return {
        icons: make_default_icons(),
        colors: make_default_colors(languageCode),
        enabled : {folderColors: true,folderIcons: true, icons: true, redNumbers: true,
            svgModify : false, // csak 2205-től volt érvényes, de 2208-tól már nem kell
            mod2208 : true, // 2208-tól érvényes módosítások
            hover : true},
        misc : {
            outlookLanguage : languageCode,
            redNumbers :
                {color : 'red',
                BGColor : '#fffffe', // ez a mező lehet 'transparent' is - sajnos 'white' (#ffffff) esetén is átlátszó lesz :-)
                borderColor :  'red', // ez is lehet 'transparent'
                borderRadiusPX : 7},
            emojis :
                {
                    rightMinusMarginPX : 15,
                    customRightMinusMargins : {
                        ChevronDownRegular : 5,
                        ChevronRightRegular : 5
                    },
                    customPaddings : {
                        ChevronDownRegular : [0,5,0,0], // top,left,right,bottom
                        ChevronRightRegular : [0,5,0,0],
                    },
                    resizeFont : true,
                    fontSizePX : 15,
                    customFontSizes : {
                        ChevronDownRegular : 10,
                        ChevronRightRegular : 10
                    }
                },
            hover : {
                BGColor : '#a5bddb'
            }
        },
        default_values : {newFolder : '', textColor : 'blue', textBGColor: TEXT_TRANSPARENT,folderEmoji:'',
            iconName : '', emoji : '', iconColor: iconColor_DEFAULT},
        active_tab : 1,
        config_version : CONFIG_VERSION
    }
}

function iconNameDatabase(){
  return  {
      AccessibiltyChecker: '\uf835',
      Add: '\ue710',
      AddEvent: '\ueeb5',
      AddFavorite: '\uf0c8',
      AddFriend: '\ue8fa',
      AddIn: '\uf775',
      AppsRegular : '\ue05f',
      Archive: '\uf03f',
      ArchiveRegular: '\ue067',
      ArrangeByFrom: '\uf678',
      ArrowCurveDownRightRegular: '?',
      ArrowForwardRegular: "\ue0c5",
      ArrowHookUpLeftRegular : '?',
      ArrowReplyAllRegular: "\ue0f5",
      ArrowReplyRegular : '\ue0f3',
      ArrowUndoRegular: '\ue13b',
      Assign: '\ue9d3',
      Attach: '\ue723',
      AttachRegular : '\ue14b',
      Balloons: '?',
      BlockContact: '\ue8f8',
      Blocked: '\ue733',
      BoxLogo: '\ued75',
      Broom: '\uea99',
      BroomRegular : '\ue23b',
      Calendar: '\ue787',
      Camera: '\ue722',
      Cancel: '\ue711',
      Chat: '\ue901',
      ChatInviteFriend: '\uecfe',
      CheckMark: '\ue73e',
      ChevronDown: '\ue70d',
      ChevronDownMed: '\ue972',
      ChevronLeft: '?',
      ChevronDownRegular: '\ue36d',
      ChevronRight: '\ue76c',
      ChevronRightMed: '\ue974',
      ChevronRightRegular: '\ue371',
      ChevronUpRegular: "\ue373",
      CircleFill: '\uea3b',
      CircleRing: '\uea3a',
      CityNext: '?',
      Clock: '\ue917',
      ClockRegular : "\ue3cd",
      Cloud: '\ue753',
      ClosePane: '\ue89f',
      CollapseContent: '\uf165',
      CommentUrgent: '\uf307',
      ComposeRegular: '\ue442',
      Contact: '\ue77b',
      ContactCard: '?',
      ContactList: '\uf7e5',
      Copy: '\ue8c8',
      CreateMailRule: '\uf67a',
      Delete: '\ue74d',
      DeleteArrowBackRegular: "\ue4dc",
      DeleteRegular: '\ue4da',
      docx20_svg : '?',
      DoubleChevronDown: '\uee04',
      Down: '\ue74b',
      Download: '\ue896',
      DraftsRegular: '\ue5e0',
      DropboxLogo: '\ued77',
      Edit: '\ue70f',
      EgnyteLogo: '\uf373',
      EmojiTabSymbols: '\ued58',
      Encryption: '\uf69d',
      EndPointSolid: '\ueb4b',
      ExploreContent: '\ueccd',
      FabricFolder: '\uf0a9',
      FabricMovetoFolder: '\uf0a5',
      FabricUserFolder: '\uf5e5',
      FavoriteStarFill: '\ue735',
      Filter: '\ue71c',
      FilterRegular: '\ue68c',
      Flag: '\ue7c1',
      FlagFilled : '?',
      FolderArrowRightRegular : '\ue6c5',
      FolderProhibitedRegular: '\ue6d9',
      FolderRegular: '\ue6bf',
      Forward: '\ue72a',
      FullScreen: '\ue740',
      GlobalNavButton: '\ue700',
      Globe: '?',
      GotoToday: '\ue8d1',
      Group: '?',
      Important: '\ue8c9',
      ImportantFilled : '\ue7c7',
      Inbox: '\uf41c',
      Info: '\ue946',
      InfoRegular : '?',
      InsertSignatureLine: '\uf677',
      Like: '\ue8e1',
      LikeSolid: '\uf3bf',
      Link: '?',
      LinkedInLogo: '\uf20a',
      List: '\uea37',
      LocaleLanguage: '\uf2b7',
      Location: '?',
      Mail: '\ue715',
      MailAlert: '\ued80',
      MailInboxRegular: '\ue875',
      MailOptions: '\uf82c',
      MailReadRegular: '\ue893',
      MarkAsProtected: '\uf6ae',
      MicrosoftTeamsAdd: '?',
      MicrosoftTeamsBrandLinkedIn: '?',
      MicrosoftTeamsInfo: '?',
      MicrosoftTranslatorLogo: '\uf782',
      MiniExpandMirrored: '\uea5a',
      More: '\ue712',
      MoreHorizontalRegular : '\ue8e9',
      MoreVertical: '\uf2bc',
      NotePinned: '\ued9a',
      NoteRegular: '\ue91b',
      OfficeChat: '\uf70f',
      OpenSource: '\uebc2',
      OpenInNewWindow: '\ue8a7',
      OutOfOffice: '?',
      Page: '\ue7c3',
      pdf20_svg : '?',
      People: '\ue716',
      Phishing: '\uf679',
      Phone: '\ue717',
      Photo2: '\ueb9f',
      Pin: '\ue718',
      PinFilled : '\uea51',
      Pinned: '\ue840',
      PinnedSolid: '\uf676',
      PinRegular : '?',
      PlainText: '\uf834',
      PlannerLogo: '?',
      Play: '\ue768',
      PlayerSettings: '\uef58',
      POI: '\uecaf',
      Print: '\ue749',
      ProhibitedRegular : '?',
      QuickNote: '\ue70b',
      Read: '\ue8c3',
      ReadOutLoud: '\uf112',
      RecruitmentManagement: '\uee12',
      ReminderGroup: '\uebf8',
      RemoveFromTrash: '\uf82b',
      Reply: '\ue97a',
      ReplyAll: '\uee0a',
      RevToggleKey: '\ue845',
      Ribbon: '?',
      Save: '\ue74e',
      Search: '\ue721',
      Send: '\ue724',
      SendRegular: '\ueb80',
      Settings: '\ue713',
      Share: '\ue72d',
      ShoppingCart: '?',
      SortDown: '\uee69',
      StarFilled: '\u2605',
      StarRegular: "\uec78",
      StatusCircleCheckmark: '\uf13e',
      Tag: '\ue8ec',
      TagRegular : '\ued42',
      TagSolid: '\uf70e',
      ThumbLikeRegular: "\uee92",
      ToDoLogoOutline: '\uf75b',
      Undo: '\ue7a7',
      Up: '\ue74a',
      Video: '\ue714',
      WarningRegular: "\uef3e"
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
        Send: '✈',
        Delete: '🗑',
        Blocked: '🚯',
        Archive: '🏴‍☠',
        QuickNote: '🧾',
        FabricFolder: '📭',
        ChevronRightMed: '👉',
        ChevronDownMed: '👇',

        MailInboxRegular: '📮',
        DraftsRegular: '✏',
        SendRegular: '✈',
        DeleteRegular: '🗑',
        FolderProhibitedRegular: '🚯',
        ArchiveRegular: '🏴‍☠',
        NoteRegular: '🧾',
        FolderRegular: '📭',
        ChevronRightRegular: '👉',
        ChevronDownRegular: '👇',
}
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

function generateCommonFoldersDatabase(){
    const chevro = OLD_CODES ? 'ChevronRightMed' : 'ChevronRightRegular'
    return [
        {dataIconName: OLD_CODES ? 'Inbox' : 'MailInboxRegular' , folderName: {en: 'Inbox', hu: 'Beérkezett üzenetek'}},
        {dataIconName: OLD_CODES ? 'Edit' : 'DraftsRegular' , folderName: {en: 'Drafts', hu: 'Piszkozatok'}},
        {dataIconName: OLD_CODES ? 'Send' : 'SendRegular', folderName: {en: 'Sent Items', hu: 'Elküldött elemek'}},
        {dataIconName: OLD_CODES ? 'Delete' : 'DeleteRegular', folderName: {en: 'Deleted Items', hu: 'Törölt elemek'}},
        {dataIconName: OLD_CODES ? 'Blocked' : 'FolderProhibitedRegular', folderName: {en: 'Junk Email', hu: 'Levélszemét'}},
        {dataIconName: OLD_CODES ? 'Archive' : 'ArchiveRegular', folderName: {en: 'Archive', hu: 'Archívum'}},
        {dataIconName: OLD_CODES ? 'QuickNote' : 'NoteRegular', folderName: {en: 'Notes', hu: 'Feljegyzések'}},

        {dataIconName: sz_FABRIC_FOLDER, folderName: {en: 'Conversation History', hu: 'Beszélgetési előzmények'}},

        // todo: angolul...
        {dataIconName: sz_FABRIC_FOLDER, folderName: {en: 'Észlelt elemek', hu: 'Észlelt elemek'}},
        {dataIconName: sz_FABRIC_FOLDER, folderName: {en: 'RSS-előfizetések', hu: 'RSS-előfizetések'}},




        {dataIconName: chevro, folderName: {en: 'Favorites', hu: 'Kedvencek'}},
        {dataIconName: chevro, folderName: {en: 'Folders', hu: 'Mappák'}},
        {dataIconName: chevro, folderName: {en: 'Groups', hu: 'Csoportok'}}
    ]
}

function translateFolderName(folderName,fromLang,toLang){
    if (fromLang === toLang){
        return folderName
    }
    for (let i = 0; i < commonFoldersDatabase.length;i++){
        if (commonFoldersDatabase[i].folderName.hasOwnProperty(fromLang) &&
            commonFoldersDatabase[i].folderName.hasOwnProperty(toLang) &&
            commonFoldersDatabase[i].folderName[fromLang] === folderName){
            return commonFoldersDatabase[i].folderName[toLang]
        }
    }
    return folderName
}

function make_default_colors(lang){
    const default_colors =
         [
            ['Inbox', '#004753'],
            ['Drafts', '#004753'],
            ['Sent Items', '#004753'],
            ['Deleted Items', 'teal'],
            ['Junk Email', 'brown'],
            ['Archive', 'blue'],
            ['Notes', 'blue'],
            ['Conversation History', '#5e5eac'],
            ['Favorites', 'green'],
            ['Folders','blue'],
            ['Groups','red']
        ]
    lang = lang.toLowerCase()
    let lang_code
    if (!lang_codes.includes(lang)){
        lang_code = lang_codes[0]
        debugLog(['lang modified:',lang,lang_code])
    } else {
        lang_code = lang
    }
    return default_colors.map(item => ({folderName: translateFolderName(item[0],'en',lang_code), textColor:item[1], textBGColor: TEXT_TRANSPARENT,folderEmoji : ''}) )
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
    let fieldName
    let err_cnt = 0
    if (!FORCE_RESET_CONFIG){
        for (let i = 0;i < config_field_names.length;i++){
            fieldName = config_field_names[i]
            if (data.hasOwnProperty(fieldName)){
                config[fieldName] = data[fieldName]
            } else {
                debugLog(['missing field:',fieldName])
                err_cnt++
            }
        }
    }
    let loaded_version = config.config_version ?? 0
    if (loaded_version !== CONFIG_VERSION) {
        debugLog(['config version mismatch:',config.config_version,CONFIG_VERSION])
        err_cnt++
    }
    if (FORCE_RESET_CONFIG || 0 < err_cnt){
        debugLog('config clever reset! (trying to load existing icons + colors)')
        config = generate_default_config(LANG_CODE)
        fieldName = 'icons'
        if (data.hasOwnProperty(fieldName)){
            config[fieldName] = normalizeIcons(data[fieldName])
        }
        fieldName = 'colors'
        if (data.hasOwnProperty(fieldName)){
            config[fieldName] = normalizeColors(data[fieldName])
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

function anythingTrue(obj){
    let result = false
    Object.keys(obj).forEach(item => {result = (result || obj[item])
    })
    return result
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

function iconCollector(importants, emptyInnertextEnabled = true){
    let inputs = document.getElementsByTagName('i')
    let found = Array()
    let iconName
    let hint
    let existing_hint
    let new_item
    let defaulthintvalue = '???'
    let important
    let style

    for(let i = 0; i < inputs.length; i++) {
        iconName = inputs[i].dataset.iconName
        hint = inputs[i].innerText  // Újítás 2022.05.09. Sok új elem került be, ahol az emoji helyett svg van, ezért nincs innerText-je!!!
        important = importants.includes(iconName)
        if (important || hint !== '' || emptyInnertextEnabled){
            existing_hint = find_emoji_placeholder(iconName,defaulthintvalue)
            if (important || existing_hint === defaulthintvalue || existing_hint === ''){
                new_item = {iconName:iconName, iconText:hint, important: important}
                found = found.concat(new_item)

                style = inputs[i].style
                style.color = 'red'
                style.backgroundColor = 'yellow'
                style.border = '3px dotted red'
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
        atob(data)
    } catch(e) {
        return false
    }
    return data
}

function generateIconStyleX(pngBase64,color,enableText2image,iconName = null){
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
            st0 = `color:${draw_color}; font-family:${foFa};font-style:normal; content:"${pngBase64}";`
            if (config.misc.emojis.resizeFont){
                let fsize = config.misc.emojis.fontSizePX
                if (iconName != null && config.misc.emojis.customFontSizes.hasOwnProperty(iconName)){
                    fsize = config.misc.emojis.customFontSizes[iconName]
                }
                st0 += `font-size:${fsize}px;`
            }
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
        let marg = config.misc.emojis.rightMinusMarginPX
        if (iconName !== null && config.misc.emojis.customRightMinusMargins.hasOwnProperty(iconName)){
            marg = config.misc.emojis.customRightMinusMargins[iconName]
        }
        st1 += `margin-right:-${marg}px;`
        if (iconName !== null && config.misc.emojis.customPaddings.hasOwnProperty(iconName)){
            let padka = config.misc.emojis.customPaddings[iconName]
            //st1 += `padding:${padka}px;`
            if (padka[0] != 0){
                st1 += `padding-top:${padka[0]}px;`
            }
            if (padka[1] != 0){
                st1 += `padding-left:${padka[1]}px;`
            }
            if (padka[2] != 0){
                st1 += `padding-right:${padka[2]}px;`
            }
            if (padka[3] != 0){
                st1 += `padding-bottom:${padka[3]}px;`
            }
        }
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

function generateIconNamePreviewStyle(iconName,txt_or_pngBase64,color,toRight){
    color = color ?? iconColor_DEFAULT ?? iconColor_DEBUG_DEFAULT
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
    let right = (toRight ? 'right' : 'left')
    let bgposx = `${right} ${delta}px`
    return `background-image: url(${img});
            background-repeat: no-repeat;
            background-position-x: ${bgposx};
            background-position-y: center;
            background-size: ${size}px ${size}px;
            padding-${right}: ${pad}px;`
}

function findDataIconName(folderName,lang){
    let dataIconName = null
    for (let i = 0;(dataIconName === null) && (i < commonFoldersDatabase.length);i++){
        if (commonFoldersDatabase[i].folderName.hasOwnProperty(lang) &&
            commonFoldersDatabase[i].folderName[lang] === folderName){
            dataIconName = commonFoldersDatabase[i].dataIconName
        }
    }
    return dataIconName
}

function generateFolderNamePreviewStyle(folderName,txt_or_pngBase64,color){
    let dataIconName = findDataIconName(folderName,config.misc.outlookLanguage) ?? sz_FABRIC_FOLDER
    let iconEmoji = null
    let iconColor = null
    for (let i = 0;(iconEmoji === null) && i < config.icons.length;i++){
        if (config.icons[i].iconName === dataIconName){
            iconEmoji = config.icons[i].iconText
            iconColor = config.icons[i].iconColor
        }
    }

    if (dataIconName === sz_FABRIC_FOLDER && txt_or_pngBase64 !== null && txt_or_pngBase64 !== ''){
        iconEmoji = txt_or_pngBase64
        iconColor = color
    }
    return generateIconNamePreviewStyle(dataIconName,iconEmoji ?? txt_or_pngBase64, iconColor ?? color,false)
}

function generateFolderEmojiPlaceholder(folderName){
    return find_emoji_placeholder(findDataIconName(folderName,config.misc.outlookLanguage) ?? sz_FABRIC_FOLDER,'?.?')
}


function text2image(txt,color,size){
    let canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size

    let style = (USE_BOLD_FONT ? 'bold ' : '') + (USE_ITALIC_FONT ? 'italic ' : '') + `${FONTSIZE_TXT2IMAGE}px ${FONTS_TXT2IMAGE}`
    let fontFamily = "controlIcons, mailIcons, peopleIcons, addinsIcons, surfaceActionIcons, FluentSystemIcons, FluentSystemIconsFilled, FluentSystemIconsRegular, \"Segoe UI Emoji\""

    let ctx = canvas.getContext('2d')
    ctx.font = style  + " " + fontFamily

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = color ?? iconColor_DEFAULT
    ctx.scale(size/CTX_WIDTH,size/CTX_WIDTH)
    ctx.fillText(txt ?? '??',CTX_WIDTH/2,CTX_WIDTH/2,CTX_WIDTH)
    return canvas.toDataURL()
}

function switchNextLanguage(){
    let actLangCode = config.misc.outlookLanguage
    let actIdx = lang_codes.findIndex(value => (value === actLangCode)   )
    if (actIdx < 0){
        return
    }
    let nextIdx = actIdx + 1
    if (lang_codes.length <= nextIdx){
        nextIdx = 0
    }
    let nextLangCode = lang_codes[nextIdx]
    let actTxt
    let newTxt
    for (let i = 0; i < config.colors.length;i++){
        actTxt = config.colors[i].folderName
        newTxt = translateFolderName(actTxt,actLangCode,nextLangCode)
        if (newTxt !== actTxt){
            config.colors[i].folderName = newTxt
            //debugLog(['translated:',actTxt,newTxt])
        }
    }
    config.misc.outlookLanguage = nextLangCode
    alert(`Language switched from '${actLangCode}' to '${nextLangCode}'.`)
}
