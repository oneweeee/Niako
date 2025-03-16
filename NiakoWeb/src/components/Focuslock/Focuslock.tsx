import { Component } from "react"
import styles from './Focuslock.module.scss'

import { IconButton } from "../IconButton/IconButton"
import { Button } from "../Button/Button"

import { ReactComponent as IconArrowLeft } from '../../assets/svg/ArrowLeft.svg'
import { ReactComponent as IconCheck } from '../../assets/svg/Check.svg'
import { Input } from "../Input/Input"

export class Focuslock extends Component<{showed: boolean, onClose: any, uploadImage: Function, image: any}, any> {
    constructor(props: any) {
        super(props)

        this.state = {
            image: null,
            showed: props.showed,
            scale: 0,
            x: 0,
            y: 0,
            mouseDown: false,
            orientation: "height",
            clientX: undefined,
            clientY: undefined,
            delta: 0
        }
    }

    render() {
        return (
            <div className={styles.focuslock_wrapper} style={{ display: this.state.showed ? 'flex' : 'none' }}>
                <div className={styles.background}></div>
                <div className={styles.focuslock}>
                    <div className={styles.content}>
                        <div className={styles.title}>
                            <IconButton icon={IconArrowLeft} useMini={true} onClick={this.props.onClose} />
                            <p className={styles.text}>Отредактировать баннер</p>
                        </div>
                        <div className={styles.description}>Попустите школьника или пропустите бабку в трамвае.</div>
                        <canvas id="invisibleCanvas" width={960} height={540} style={{ display: "none" }} />
                        <canvas id="mainCanvas" width={856} height={481.5} className={styles.FocusLock_canvas}
                        onMouseDown={() => {
                            this.setState({
                                mouseDown: true, clientX: undefined
                            })
                        }}
                        onMouseUp={() => {
                            this.setState({
                                mouseDown: false, clientX: undefined
                            })
                        }}
                        onMouseLeave={() => {
                            this.setState({
                                mouseDown: false,
                                clientX: undefined
                            })
                        }}
                        onMouseMove={async (e) => {
                            if(this.state.mouseDown) {
                                if(this.state.clientX === undefined) {
                                    return this.setState({ clientX: e.clientX, clientY: e.clientY })

                                }
                                let offsetX = e.clientX - this.state.clientX
                                let offsetY = e.clientY - this.state.clientY
                                let newX = (this.state.x + offsetX)
                                let newY = (this.state.y + offsetY)
              
                                if(newY > this.state.maxY) newY = this.state.maxY
                                if(newY < this.state.minY) newY = this.state.minY
                                if(newX > this.state.maxX) newX = this.state.maxX
                                if(newX < this.state.minX) newX = this.state.minX
              
                                this.setState({
                                    clientX: e.clientX,
                                    clientY: e.clientY,
                                    x: newX,
                                    y: newY
                                })
                            
                                this.updateCanvas()

                            }
                        }}></canvas>
                        <Input
                        onChange={this.onChangeRadio.bind(this)}
                        type="range"
                        min={0}
                        max={100}/>
                        <Button onClick={async () => {
                            let file = await this.getImage()
                            this.props.uploadImage(file)
                            this.props.onClose()
                        }} type='Fill' content="Сохранить" icon={IconCheck} alignSelf="stretch" />
                    </div>
                </div>
            </div>
        )
    }

    onChangeRadio(e: any) {
        this.setState({
            scale: parseInt(e.target.value) / 100
        })
        
        if(this.state.orientation === "width") {
            this.setState({y: -this.state.image.height * this.state.scale});
        }
        
        if(this.state.orientation === "height") {
            this.setState({x: -this.state.image.width * this.state.scale});
        }
        
        return this.updateCanvas()
    }

    componentDidUpdate(prevProps: any) {
        if(prevProps.showed !== this.props.showed) {
            this.setState({ showed: this.props.showed })
        }
    
        if(prevProps.image !== this.props.image) {
            var img = new Image()
            img.onload = async () => {
                await this.setState({
                    image: img
                })

                setTimeout(() => {
                    this.updateCanvas()
                }, 2000)
            }
            
            img.src = URL.createObjectURL(this.props.image)
        }
    }

    async getImage() {
        if(!this.state.image) return
    
        const invisibleCanvas = document.getElementById('invisibleCanvas')! as HTMLCanvasElement
        const canvas = document.getElementById('mainCanvas')! as HTMLCanvasElement
    
        const ictx = invisibleCanvas.getContext('2d')!
    
        let image = this.state.image
    
        let widtha = canvas.width
        let heightb = canvas.height
        let heighte = 540 / 960 * widtha
    
        let heightd
        let widthd
    
        if(this.state.orientation === "width") {
            widthd = image.width/image.height * heighte * (this.state.scale + 1)
            heightd = heighte * (this.state.scale + 1)
        } else {
            heightd = image.height/image.width * widtha * (this.state.scale + 1)
            widthd = widtha * (this.state.scale + 1)
        }
    
        let deltaf = heightb - heighte
        let deltac = deltaf / 2
    
        let x = this.state.x
        let y = this.state.y - deltac
    
        ictx.drawImage(image, x, y, widthd, heightd)
    
        let data = invisibleCanvas.toDataURL("image/png")
    
        let file = await fetch(data).then(res => res.blob())
        
        return file
    }
    
    updateCanvas() {
        const canvas = document.getElementById('mainCanvas')! as HTMLCanvasElement
        const ctx = canvas.getContext('2d')!
    
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    
        if(this.state.image) {
            let image = this.state.image
            if(image.width/image.height > canvas.width/canvas.height) {
                let widtha = canvas.width
                let heightb = canvas.height
                let heighte = 540 / 960 * widtha
                let widthd = image.width/image.height * heighte * (this.state.scale + 1)
                let heightd = heighte * (this.state.scale + 1)
                let deltac = (heightb - heighte) / 2
                let deltaf = heightd - heighte
                
                ctx.drawImage(image, this.state.x, this.state.y, widthd, heightd)
                
                this.setState({
                  orientation: "width",
                  minX: -(widthd - widtha),
                  maxX: 0,
                  minY: -deltaf + deltac,
                  maxY: deltac
                })
            } else {
                let widtha = canvas.width
                let heightb = canvas.height
                let heighte = 540 / 960 * widtha
                let heightd = image.height/image.width * widtha * (this.state.scale + 1)
                let widthd = widtha * (this.state.scale + 1)
                let deltac = (heightb - heighte) / 2
                let deltaf = heightd - heighte
                
                ctx.drawImage(image, this.state.x, this.state.y, widthd, heightd)
                
                this.setState({
                  orientation: "height",
                  minX: -(widthd - widtha),
                  maxX: 0,
                  minY: -deltaf + deltac,
                  maxY: deltac
                })
            }
        }
    
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
    
        ctx.strokeStyle = "white"
        ctx.lineWidth = 5
    
        let width = canvas.width
        let height = 540 / 960 * width
    
        let delta = (canvas.height - height) / 2
    
        ctx.fillRect(0, 0, width, delta)
        ctx.fillRect(0, delta + height, width, delta)
    
        ctx.strokeRect(2.5, delta, width-5, height)
    }
}