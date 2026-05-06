# -*- coding: utf-8 -*-
import logging

_logger = logging.getLogger(__name__)


def migrate(cr, version):
    """Backup legacy Selection column bbweb_blog_post.category before ORM drops it."""
    cr.execute(
        """
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'bbweb_blog_post'
          AND column_name = 'category'
        """
    )
    if not cr.fetchone():
        return
    cr.execute("DROP TABLE IF EXISTS bbweb_blog_post_category_mig")
    cr.execute(
        """
        CREATE TABLE bbweb_blog_post_category_mig AS
        SELECT id, category FROM bbweb_blog_post
        """
    )
    _logger.info(
        "binary_buddies_web: backed up bbweb_blog_post.category -> bbweb_blog_post_category_mig"
    )
