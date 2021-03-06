import { Component } from 'preact'
import Form from '../components/form'
import config from '../config'
import 'linkstate/polyfill'
import withStyles from '../components/jss'

import { register, login } from '../api/auth'
import UserCircle from '../icons/user-circle.svg'
import EnvelopeOpen from '../icons/envelope-open.svg'
import CtftimeButton from '../components/ctftime-button'
import CtftimeAdditional from '../components/ctftime-additional'
import AuthOr from '../components/or'

export default withStyles({
  root: {
    padding: '1.5em',
    maxWidth: '500px'
  },
  submit: {
    marginTop: '1.5em'
  },
  or: {
    textAlign: 'center'
  }
}, class Register extends Component {
  state = {
    name: '',
    email: '',
    division: config.defaultDivision.toString(),
    ctftimeToken: undefined,
    disabledButton: false,
    errors: {}
  }

  componentDidMount () {
    document.title = `Registration${config.ctfTitle}`
  }

  render ({ classes }, { name, email, disabledButton, errors, ctftimeToken }) {
    if (ctftimeToken) {
      return <CtftimeAdditional ctftimeToken={ctftimeToken} />
    }
    return (
      <div class='row u-center'>
        <Form class={`${classes.root} col-6`} onSubmit={this.handleSubmit} disabled={disabledButton} errors={errors} buttonText='Register'>
          <input autofocus required icon={<UserCircle />} name='name' placeholder='Team Name' type='text' value={name} onChange={this.linkState('name')} />
          <input required icon={<EnvelopeOpen />} name='email' placeholder='Email' type='text' value={email} onChange={this.linkState('email')} />
        </Form>
        <AuthOr />
        <CtftimeButton class={`${classes.root} col-6`} onCtftimeDone={this.handleCtftimeDone} />
      </div>
    )
  }

  handleCtftimeDone = async (ctftimeToken) => {
    this.setState({
      disabledButton: true
    })
    const loginRes = await login({
      ctftimeToken
    })
    if (loginRes && loginRes.badUnknownUser) {
      this.setState({
        ctftimeToken
      })
    }
  }

  handleSubmit = e => {
    e.preventDefault()

    this.setState({
      disabledButton: true
    })

    register(this.state)
      .then(errors => {
        if (!errors) {
          return
        }

        this.setState({
          errors,
          disabledButton: false
        })
      })
  }
})
