import { Component, createRef } from 'react'
import Picker from '@emoji-mart/react'
import styles from './ButtonSettings.module.scss'
import { TextDropdown } from '../../../../../components/Dropdown/TextDropdown'
import { Input } from '../../../../../components/Input/Input'

import { ReactComponent as IconAddCircle } from '../../../../../assets/svg/AddCircleStroke.svg'
import { ReactComponent as IconArrowDown } from '../../../../../assets/svg/ArrowDown.svg'
import { ReactComponent as IconSmile } from '../../../../../assets/svg/SmileStroke.svg'
import { ReactComponent as IconTrash } from '../../../../../assets/svg/Trash.svg'
import { ReactComponent as IconButtonDefault } from '../../../../../assets/svg/ButtonDefault.svg'
import { ReactComponent as IconButtonGreen } from '../../../../../assets/svg/ButtonGreen.svg'
import { ReactComponent as IconButtonBlue } from '../../../../../assets/svg/ButtonBlue.svg'
import { ReactComponent as IconButtonRed } from '../../../../../assets/svg/ButtonRed.svg'
import { ReactComponent as IconRoomCrown } from '../../../../../assets/svg/RoomCrown.svg'
import { ReactComponent as IconRoomRename } from '../../../../../assets/svg/RoomRename.svg'
import { ReactComponent as IconRoomLimit } from '../../../../../assets/svg/RoomLimit.svg'
import { ReactComponent as IconRoomKick } from '../../../../../assets/svg/RoomKick.svg'
import { ReactComponent as IconRoomLock } from '../../../../../assets/svg/RoomLock.svg'
import { ReactComponent as IconRoomUnlock } from '../../../../../assets/svg/RoomUnlock.svg'
import { ReactComponent as IconRoomAddUser } from '../../../../../assets/svg/RoomAddUser.svg'
import { ReactComponent as IconRoomRemoveUser } from '../../../../../assets/svg/RoomRemoveUser.svg'
import { ReactComponent as IconRoomUser } from '../../../../../assets/svg/RoomUser.svg'
import { ReactComponent as IconRoomMute } from '../../../../../assets/svg/RoomMute.svg'
import { ReactComponent as IconRoomUnmute } from '../../../../../assets/svg/RoomUnmute.svg'
import { ReactComponent as IconRoomUp } from '../../../../../assets/svg/ArrowDoubleUp.svg'
import { ReactComponent as IconRoomUnhide } from '../../../../../assets/svg/EyeOpened.svg'
import { ReactComponent as IconRoomReset } from '../../../../../assets/svg/RoomReset.svg'
import { ReactComponent as IconRoomInfo } from '../../../../../assets/svg/RoomInfo.svg'
import { ReactComponent as IconRoomPlusLimit } from '../../../../../assets/svg/AddCircleStroke.svg'
import { ReactComponent as IconRoomMinusLimit } from '../../../../../assets/svg/RemoveCircleStroke.svg'

export class ButtonSettings extends Component<
	{ className: any; data: any; updateState: any; sendError: any; discord: any },
	{
		openedPicker: string | null
		ref: any
		opens: string[]
		emojis: any[]
		customEmojis: any[],
		accordions: { [ key: string ]: any }
	}
> {
	render() {
		return (
			<div
				className={`${styles.settings} ${this.props.className}`}
				id='settings'
			>
				<div className={styles.cell}>
					<div className={styles.title}>
						<IconAddCircle className={styles.icon} />
						<p className={styles.text}>Добавить кнопку</p>
					</div>
					<TextDropdown
						onClick={this.onClickAddNewButton.bind(this)}
						input={true}
						placeholder='Выберите тип кнопки'
						options={[
							...Object.keys(this.state.customEmojis[0].emojis),
							'Up',
						].map(v => ({
							label: this.getLabel(v),
							value: v,
							icon: this.getIcon(v),
						}))}
					/>
				</div>
				<div className={styles.buttons}>
					{Object.values(this.props.data.buttons)
						.filter((b: any) => b.used)
						.sort(
							(a: any, b: any) =>
								a.position.row - b.position.row &&
								a.position.button - b.position.button
						)
						.map((b: any) => {
							return this.getButton(b, b.type)
						})}
				</div>
			</div>
		)
	}

	getButton(b: any, key: string) {
		return (
			<div className={styles.button} key={key}>
				<div
					className={styles.accordion}
					onClick={this.onClickAccrodion.bind(this, key)}
				>
					<div className={styles.content}>
						{ b?.emoji && this.getEmojiIcon(b.emoji) }
						<p className={styles.text}>{this.getLabel(key)}</p>
					</div>
					<div className={styles.manage}>
						<div
							className={styles.minbutton}
							onClick={this.onClickDelete.bind(this, key)}
						>
							<IconTrash className={styles.icon} />
						</div>
						<IconArrowDown
							className={`${styles.icon} ${this.state.accordions[key]}`}
						/>
					</div>
				</div>
				{this.state.opens.includes(key) ? (
					<div className={styles.group}>
						<div className={styles.row}>
							<div className={styles.containerCell}>
								<div className={styles.cell}>
									<p className={styles.title}>Эмодзи</p>
									<div
										className={styles.position}
										ref={
											this.state.openedPicker !== key
												? undefined
												: (this.state.ref as any)
										}
									>
										<div
											className={`${styles.minbutton} ${styles.minbutton_big}`}
											onClick={this.onClickEmojiPicker.bind(this, key)}
										>
											<IconSmile className={styles.icon} />
										</div>
										{this.state.openedPicker !== key ? (
											''
										) : (
											<Picker
												skinTonePosition='none'
												previewEmoji='blue_heart'
												data={async () => {
													const response = await fetch(
														'https://cdn.jsdelivr.net/npm/@emoji-mart/data/sets/14/twitter.json'
													)
													return await response.json()
												}}
												icons='outline'
												locale='ru'
												set='twitter'
												onEmojiSelect={this.onClickEmoji.bind(this, key)}
												custom={[
													...this.state.emojis,
													...this.state.customEmojis.map(cfg => {
														return {
															...cfg,
															emojis: Object.values(cfg.emojis).map(
																(e: string) => {
																	const id = e.split(':')[2].replace('>', '')
																	const name = e.split(':')[1]
																	return {
																		id: `<:${name}:${id}>`,
																		name,
																		keywords: ['discord', 'custom'],
																		skins: [
																			{
																				src: `https://cdn.discordapp.com/emojis/${id}.png?size=256`,
																			},
																		],
																	}
																}
															),
														}
													}),
												]}
											/>
										)}
									</div>
								</div>
								<div
									style={{ width: '100%' }}
									className={`${styles.cell} ${styles.drops}`}
								>
									<p className={styles.title}>Лейбл кнопки</p>
									<Input
										onChange={this.onInputButtonLabel.bind(this, key)}
										maxLength={80}
										value={b.label}
									/>
								</div>
							</div>
							<div
								style={{ width: '100%' }}
								className={`${styles.cell} ${styles.drops}`}
							>
								<p className={styles.title}>Стиль</p>
								<TextDropdown
									onClick={this.onClickButtonStyle.bind(this, key)}
									defaultValue={String(b.style)}
									placeholder='Выберите стиль кнопки'
									options={[
										{
											label: 'Обычный',
											value: '2',
											icon: <IconButtonDefault />,
										},
										{
											label: 'Синий',
											value: '1',
											icon: <IconButtonBlue />,
										},
										{
											label: 'Зелёный',
											value: '3',
											icon: <IconButtonGreen />,
										},
										{
											label: 'Красный',
											value: '4',
											icon: <IconButtonRed />,
										},
									]}
								/>
							</div>
						</div>
					</div>
				) : (
					''
				)}
			</div>
		)
	}

	componentDidMount() {
		document.addEventListener('click', this.handleOutsideClick.bind(this))
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.handleOutsideClick.bind(this))
	}

	onClickAddNewButton(type: string) {
		const btns = Object.assign(this.props.data.buttons)
		const btn = btns[type]
		if (!btn) return

		if (btn.used) {
			return this.props.sendError('Данная кнопка уже используется')
		}

		btn.used = true
		btn.position = this.resolveButtonPosition()

		return this.props.updateState({
			canSave: true,
			data: {
				...this.props.data,
				buttons: btns,
			},
		})
	}

	onClickAccrodion(type: string) {
		const accordions = structuredClone(this.state.accordions)
		if (this.state.opens.includes(type)) {
			this.state.opens.splice(this.state.opens.indexOf(type), 1)
			accordions[type] = styles.close_icon
            return this.setState({ opens: this.state.opens, accordions })
		} else {
			this.state.opens.push(type)
			accordions[type] = styles.open_icon
            return this.setState({ opens: this.state.opens, accordions })
		}
	}

	onClickDelete(type: string) {
		const btns = Object.assign(this.props.data.buttons)
		const btn = btns[type]
		if (!btn) return
		if (1 >= Object.values(btns).filter((b: any) => b?.used).length) {
			return this.props.sendError('Должна использоваться хоть одна кнопка')
		}

		btn.used = false

		return this.props.updateState({
			canSave: true,
			data: {
				...this.props.data,
				buttons: btns,
			},
		})
	}

	onClickEmojiPicker(type: string) {
		return this.setState({
			openedPicker: type === this.state.openedPicker ? null : type,
		})
	}

	onClickEmoji(type: string, e: any) {
		const btns = Object.assign(this.props.data.buttons)
		const btn = btns[type]
		if (!btn) return

		if (e?.native) {
			btn.emoji = e.native
		} else {
			btn.emoji = e.shortcodes.slice(1, e.shortcodes.length - 1)
		}

		this.setState({ openedPicker: null })

		return this.props.updateState({
			canSave: true,
			data: {
				...this.props.data,
				buttons: btns,
			},
		})
	}

	onInputButtonLabel(type: string, e: any) {
		const btns = Object.assign(this.props.data.buttons)
		const btn = btns[type]
		if (!btn) return

		const value = e.target.value
		if (value.length > 80 || value[value.length-1] === ' ') return

		btn.label = value

		return this.props.updateState({
			canSave: true,
			data: {
				...this.props.data,
				buttons: btns,
			},
		})
	}

	onClickButtonStyle(type: string, value: string) {
		const btns = Object.assign(this.props.data.buttons)
		const btn = btns[type]
		if (!btn) return

		btn.style = Number(value)

		return this.props.updateState({
			canSave: true,
			data: {
				...this.props.data,
				buttons: btns,
			},
		})
	}

	handleOutsideClick(e: any) {
		if (
			this.state.openedPicker &&
			this.state.ref?.current &&
			!(this.state.ref.current as any).contains(e.target)
		) {
			this.setState({ openedPicker: null })
		}
	}

	resolveButtonPosition(compact: boolean = false) {
		let filter = Object.values(this.props.data.buttons).filter(
			(b: any) => b.position.row === 1 && b.used
		)
		if (filter.length >= (compact ? 4 : 5)) {
			filter = Object.values(this.props.data.buttons).filter(
				(b: any) => b.position.row === 2 && b.used
			)
			if (filter.length >= (compact ? 4 : 5)) {
				filter = Object.values(this.props.data.buttons).filter(
					(b: any) => b.position.row === 3 && b.used
				)
				if (filter.length >= (compact ? 4 : 5)) {
					return {
						row: 4,
						button:
							Object.values(this.props.data.buttons).filter(
								(b: any) => b.position.row === 4 && b.used
							).length + 1,
					}
				}
				return { row: 3, button: filter.length + 1 }
			}
			return { row: 2, button: filter.length + 1 }
		}
		return { row: 1, button: filter.length + 1 }
	}

	getLabel(type: string) {
		switch (type) {
			case 'Crown':
				return 'Передача прав на комнату'
			case 'Rename':
				return 'Изменение названия комнаты'
			case 'Limit':
				return 'Изменение лимита комнаты'
			case 'Kick':
				return 'Выгнать участника с комнаты'
			case 'Lock':
				return 'Закрыть комнату'
			case 'Unlock':
				return 'Открыть комнату'
			case 'RemoveUser':
				return 'Забрать доступ к комнате'
			case 'AddUser':
				return 'Выдать доступ к комнате'
			case 'Mute':
				return 'Заглушение участника в комнате'
			case 'Unmute':
				return 'Разглушение участника в комнате'
			case 'StateHide':
				return 'Скрыть & Раскрыть комнату'
			case 'StateUser':
				return 'Забрать & Выдать доступ к комнате'
			case 'StateLock':
				return 'Закрыть & Открыть комнату'
			case 'StateMute':
				return 'Заглушение & Разглушение участника в комнате'
			case 'Reset':
				return 'Сброс прав пользователя'
			case 'Info':
				return 'Информация о комнате'
			case 'MinusLimit':
				return 'Добавить слот в комнату'
			case 'PlusLimit':
				return 'Убрать слот с комнаты'
			case 'Up':
				return 'Поднять комнату вверх'
			default:
				return type
		}
	}

	getIcon(type: string) {
		switch (type) {
			case 'Crown':
				return <IconRoomCrown className={styles.icon} />
			case 'Rename':
				return <IconRoomRename className={styles.icon} />
			case 'Limit':
				return <IconRoomLimit className={styles.icon} />
			case 'Kick':
				return <IconRoomKick className={styles.icon} />
			case 'Lock':
				return <IconRoomLock className={styles.icon} />
			case 'Unlock':
				return <IconRoomUnlock className={styles.icon} />
			case 'RemoveUser':
				return <IconRoomRemoveUser className={styles.icon} />
			case 'AddUser':
				return <IconRoomAddUser className={styles.icon} />
			case 'Mute':
				return <IconRoomMute className={styles.icon} />
			case 'Unmute':
				return <IconRoomUnmute className={styles.icon} />
			case 'StateHide':
				return <IconRoomUnhide className={styles.icon} />
			case 'StateUser':
				return <IconRoomUser className={styles.icon} />
			case 'StateLock':
				return <IconRoomLock className={styles.icon} />
			case 'StateMute':
				return <IconRoomMute className={styles.icon} />
			case 'Reset':
				return <IconRoomReset className={styles.icon} />
			case 'Info':
				return <IconRoomInfo className={styles.icon} />
			case 'MinusLimit':
				return <IconRoomMinusLimit className={styles.icon} />
			case 'PlusLimit':
				return <IconRoomPlusLimit className={styles.icon} />
			case 'Up':
				return <IconRoomUp className={styles.icon} />
			default:
				return ''
		}
	}

	private getEmojiIcon(emoji?: string) {
        if(!emoji) return ''
        if(!emoji.startsWith('<')) {
            return (<p>{emoji}</p>)
        }
        if(!emoji.endsWith('>')) return ''
        if(emoji.split(':')?.length !== 3) return ''

        const src = `https://cdn.discordapp.com/emojis/${emoji.split(':')[2].replace('>', '')}.${emoji.startsWith('<a:') ? 'gif' : 'png'}?size=96`
        return (
            <img style={{width: "32px", height: "32px"}} src={src} alt='emoji'/>
        )
    }

	state = {
		accordions: {} as any,
		openedPicker: null,
		ref: createRef(),
		opens: [] as string[],
		customEmojis: [
			{
				name: 'Обычные',
				id: 'NK_Default',
				emojis: {
					Crown: '<:NK_RoomCrown:1103924936067792997>',
					Rename: '<:NK_RoomRename:1103924955239944212>',
					Limit: '<:NK_RoomLimit:1103924942141128754>',
					Kick: '<:NK_RoomKick:1103924940568264734>',
					Lock: '<:NK_RoomLock:1103924944745807882>',
					Unlock: '<:NK_RoomUnlock:1103924962588364852>',
					RemoveUser: '<:NK_RoomRemoveUser:1103924953302175805>',
					AddUser: '<:NK_RoomAddUser:1103924933261787146>',
					Mute: '<:NK_RoomMute:1103924949036564601>',
					Unmute: '<:NK_RoomUnmute:1103925037486067732>',
					StateHide: '<:NK_RoomShowed:1103924960281505792>',
					StateUser: '<:NK_RoomUsered:1103924965281112186>',
					StateLock: '<:NK_RoomLocked:1103924946264146001>',
					StateMute: '<:NK_RoomMuted:1103924950668156928>',
					Reset: '<:NK_RoomReset:1103924958041751572>',
					Info: '<:NK_RoomInfo:1103924937854550067>',
					MinusLimit: '<:NK_RoomLimitMinus:1125606983412744282>',
					PlusLimit: '<:NK_RoomLimitPlus:1125606986495574046>',
				},
			},
			{
				name: 'Розовые',
				id: 'NK_Pink',
				emojis: {
					Crown: '<:NK_SPinkRoomCrown:1106583555695448086>',
					Rename: '<:NK_SPinkRoomRename:1106583576314646689>',
					Limit: '<:NK_SPinkRoomLimit:1106583562897080432>',
					Kick: '<:NK_SPinkRoomKick:1106583560657305730>',
					Lock: '<:NK_SPinkRoomLock:1106583565862453340>',
					Unlock: '<:NK_SPinkRoomUnlock:1106583583881183242>',
					RemoveUser: '<:NK_SPinkRoomRemoveUser:1106583574997635073>',
					AddUser: '<:NK_SPinkRoomAddUser:1106583552818171965>',
					Mute: '<:NK_SPinkRoomMute:1106583570358734929>',
					Unmute: '<:NK_SPinkRoomUnmute:1106583585399505056>',
					StateHide: '<:NK_SPinkRoomShowed:1106583580823519265>',
					StateUser: '<:NK_SPinkRoomUsered:1106583629401956405>',
					StateLock: '<:NK_SPinkRoomLocked:1106583567397568582>',
					StateMute: '<:NK_SPinkRoomMuted:1106583572258770984>',
					Reset: '<:NK_SPinkRoomReset:1106583579481350214>',
					Info: '<:NK_SPinkRoomInfo:1106583557465460776>',
					MinusLimit: '<:NK_SPinkRoomLimitMinus:1125607252217315348>',
					PlusLimit: '<:NK_SPinkRoomLimitPlus:1125607254637432883>',
				},
			},
			{
				name: 'Голубые',
				id: 'NK_Blue',
				emojis: {
					Crown: '<:NK_SBlueRoomCrown:1106586088652423280>',
					Rename: '<:NK_SBlueRoomRename:1106586110005616810>',
					Limit: '<:NK_SBlueRoomLimit:1106586094977425409>',
					Kick: '<:NK_SBlueRoomKick:1106586093316493343>',
					Lock: '<:NK_SBlueRoomLock:1106586097871495258>',
					Unlock: '<:NK_SBlueRoomUnlock:1106586117601497109>',
					RemoveUser: '<:NK_SBlueRoomRemoveUser:1106586108084621333>',
					AddUser: '<:NK_SBlueRoomAddUser:1106586084550385696>',
					Mute: '<:NK_SBlueRoomMute:1106586102984355891>',
					Unmute: '<:NK_SBlueRoomUnmute:1106586119623147562>',
					StateHide: '<:NK_SBlueRoomShowed:1106586115072331847>',
					StateUser: '<:NK_SBlueRoomUsered:1106586122580135936>',
					StateLock: '<:NK_SBlueRoomLocked:1106586099729580155>',
					StateMute: '<:NK_SBlueRoomMuted:1106586105085706271>',
					Reset: '<:NK_SBlueRoomReset:1106586112950018068>',
					Info: '<:NK_SBlueRoomInfo:1106586090602758234>',
					MinusLimit: '<:NK_SBlueRoomLimitMinus:1125607219594018896>',
					PlusLimit: '<:NK_SBlueRoomLimitPlus:1125607222634872964>',
				},
			},
			{
				name: 'Красные',
				id: 'NK_Red',
				emojis: {
					Crown: '<:NK_SRedRoomCrown:1106598273130696794>',
					Rename: '<:NK_SRedRoomRename:1106598296119676978>',
					Limit: '<:NK_SRedRoomLimit:1106598281154408509>',
					Kick: '<:NK_SRedRoomKick:1106598277853491200>',
					Lock: '<:NK_SRedRoomLock:1106598282500788356>',
					Unlock: '<:NK_SRedRoomUnlock:1106598303631687710>',
					RemoveUser: '<:NK_SRedRoomRemoveUser:1106598294131576862>',
					AddUser: '<:NK_SRedRoomAddUser:1106598269636857890>',
					Mute: '<:NK_SRedRoomMute:1106598288574124132>',
					Unmute: '<:NK_SRedRoomUnmute:1106598305590423643>',
					StateHide: '<:NK_SRedRoomShowed:1106598300636954685>',
					StateUser: '<:NK_SRedRoomUsered:1106598308794871818>',
					StateLock: '<:NK_SRedRoomLocked:1106598286351147080>',
					StateMute: '<:NK_SRedRoomMuted:1106598291594027078>',
					Reset: '<:NK_SRedRoomReset:1106598298908897400>',
					Info: '<:NK_SRedRoomInfo:1106598274674196602>',
					MinusLimit: '<:NK_SRedRoomLimitMinus:1125607486389497867>',
					PlusLimit: '<:NK_SRedRoomLimitPlus:1125607487844921446>',
				},
			},
			{
				name: 'Фиолетовые',
				id: 'NK_Purple',
				emojis: {
					Crown: '<:NK_SPurpleRoomCrown:1106598172085731410>',
					Rename: '<:NK_SPurpleRoomRename:1106598193308913745>',
					Limit: '<:NK_SPurpleRoomLimit:1106598179849371738>',
					Kick: '<:NK_SPurpleRoomKick:1106598178091958272>',
					Lock: '<:NK_SPurpleRoomLock:1106598182659575942>',
					Unlock: '<:NK_SPurpleRoomUnlock:1106598200309186580>',
					RemoveUser: '<:NK_SPurpleRoomRemoveUser:1106598191727656991>',
					AddUser: '<:NK_SPurpleRoomAddUser:1106598170856792225>',
					Mute: '<:NK_SPurpleRoomMute:1106598187168436304>',
					Unmute: '<:NK_SPurpleRoomUnmute:1106598244458438676>',
					StateHide: '<:NK_SPurpleRoomShowed:1106598197163470879>',
					StateUser: '<:NK_SPurpleRoomUsered:1106598203048079413>',
					StateLock: '<:NK_SPurpleRoomLocked:1106598184261799977>',
					StateMute: '<:NK_SPurpleRoomMuted:1106598188976189560>',
					Reset: '<:NK_SPurpleRoomReset:1106598195980664872>',
					Info: '<:NK_SPurpleRoomInfo:1106598175265017916>',
					MinusLimit: '<:NK_SPurpleRoomLimitMinus:1125607125507391498>',
					PlusLimit: '<:NK_SPurpleRoomLimitPlus:1125607128716025997>',
				},
			},
			{
				name: 'Зелёные',
				id: 'NK_Green',
				emojis: {
					Crown: '<:NK_SGreenRoomCrown:1106598332635303976>',
					Rename: '<:NK_SGreenRoomRename:1106598355846574222>',
					Limit: '<:NK_SGreenRoomLimit:1106598340998725813>',
					Kick: '<:NK_SGreenRoomKick:1106598338004005055>',
					Lock: '<:NK_SGreenRoomLock:1106598342508687490>',
					Unlock: '<:NK_SGreenRoomUnlock:1106598363853488129>',
					RemoveUser: '<:NK_SGreenRoomRemoveUser:1106598354198216834>',
					AddUser: '<:NK_SGreenRoomAddUser:1106598329170796645>',
					Mute: '<:NK_SGreenRoomMute:1106598347869011988>',
					Unmute: '<:NK_SGreenRoomUnmute:1106598365543805001>',
					StateHide: '<:NK_SGreenRoomShowed:1106598360632283136>',
					StateUser: '<:NK_SGreenRoomUsered:1106598368840523777>',
					StateLock: '<:NK_SGreenRoomLocked:1106598345234985091>',
					StateMute: '<:NK_SGreenRoomMuted:1106598351299956816>',
					Reset: '<:NK_SGreenRoomReset:1106598358757408939>',
					Info: '<:NK_SGreenRoomInfo:1106598334799544482>',
					PlusLimit: '<:NK_SGreenRoomLimitPlus:1125607292797194261>',
					MinusLimit: '<:NK_SGreenRoomLimitMinus:1125607290007990292>',
				},
			},
			{
				name: 'Жёлтые',
				id: 'NK_Yellow',
				emojis: {
					Crown: '<:NK_SYellowRoomCrown:1106598551208853615>',
					Rename: '<:NK_SYellowRoomRename:1106598570964045824>',
					Limit: '<:NK_SYellowRoomLimit:1106598557265449001>',
					Kick: '<:NK_SYellowRoomKick:1106598555277340692>',
					Lock: '<:NK_SYellowRoomLock:1106598559865897040>',
					Unlock: '<:NK_SYellowRoomUnlock:1106598578337619978>',
					RemoveUser: '<:NK_SYellowRoomRemoveUser:1106598568908832820>',
					AddUser: '<:NK_SYellowRoomAddUser:1106598548172181564>',
					Mute: '<:NK_SYellowRoomMute:1106598564274122884>',
					Unmute: '<:NK_SYellowRoomUnmute:1106598580120195213>',
					StateHide: '<:NK_SYellowRoomShowed:1106598575321919559>',
					StateUser: '<:NK_SYellowRoomUsered:1106598582909419674>',
					StateLock: '<:NK_SYellowRoomLocked:1106598561518473216>',
					StateMute: '<:NK_SYellowRoomMuted:1106598566094446612>',
					Reset: '<:NK_SYellowRoomReset:1106598573786796172>',
					Info: '<:NK_SYellowRoomInfo:1106598552446189710>',
					MinusLimit: '<:NK_SYellowRoomLimitMinus:1125607195007012934>',
					PlusLimit: '<:NK_SYellowRoomLimitPlus:1125607198114992199>',
				},
			},
		],
		emojis: [
			{
				id: 'custom',
				name: 'Кастомные',
				keywords: [],
				emojis: this.props.discord.emojis.map(
					(e: { id: string; name: string; animated: boolean }) => ({
						id: `<${e.animated ? 'a' : ''}:${e.name}:${e.id}>`,
						name: e.name,
						keywords: ['discord', 'custom'],
						skins: [
							{
								src: `https://cdn.discordapp.com/emojis/${e.id}.${
									e.animated ? 'gif' : 'png'
								}?size=256`,
							},
						],
					})
				),
			},
		],
	}
}
