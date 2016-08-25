/*
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES LOSS OF USE, DATA, OR PROFITS OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
 * IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

'use strict'

/*
 * simple use case. Create an instance of mu, define two action handlers and then execute them
 */


var mu = require('mu')()


// define handlers

mu.define({role: 'test', cmd: 'one'}, function (args, cb) {
  mu.log.info('in one', args)
  cb()
})

mu.define({role: 'test', cmd: 'two'}, function (args, cb) {
  mu.log.info('in two', args)
  cb(null, {my: 'response'})
})


// execute handlers

mu.dispatch({role: 'test', cmd: 'one', fish: 'cheese'}, function (err, result) {
  mu.log.info('in cb')
  mu.log.info(err)
  mu.log.info(result)
})

mu.dispatch({role: 'test', cmd: 'two', fish: 'cheese'}, function (err, result) {
  mu.log.info('in cb')
  mu.log.info(err)
  mu.log.info(result)
})

