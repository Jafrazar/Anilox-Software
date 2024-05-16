function soloAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' })
  }
  next()
}

function soloPublico(req, res, next) {
    if (req.user.role !== 'public') {
        return res.status(403).json({ message: 'Unauthorized' })
    }
    next()
}

module.exports = { soloAdmin, soloPublico };