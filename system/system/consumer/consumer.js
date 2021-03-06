/*
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
 * IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

'use strict'


var mu = require('mu')()

module.exports = function () {

  function consume (cb) {
    mu.dispatch({role: 's2', cmd: 'one', fish: 'cheese'}, function (err, result) {
      if (err) { console.log(err) }
      console.log('in cb 1')
      console.log(result)
      mu.dispatch({role: 's1', cmd: 'two', fish: 'cheese'}, function (err, result) {
        if (err) { console.log(err) }
        console.log('in cb 2')
        console.log(result)
        mu.dispatch({role: 's3', cmd: 'one'}, function (err, result) {
          if (err) { console.log(err) }
          console.log('in cb 3')
          console.log(result)
          cb()
        })
      })
    })
  }

  return {
    mu: mu,
    consume: consume
  }
}

