# -*- coding: utf-8 -*-
import logging

_logger = logging.getLogger(__name__)


def migrate(cr, version):
    """Map legacy category keys onto bbweb.blog.category after schema + data load."""
    cr.execute(
        """
        SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_schema = 'public'
              AND table_name = 'bbweb_blog_post_category_mig'
        )
        """
    )
    if not cr.fetchone()[0]:
        return

    cr.execute(
        """
        UPDATE bbweb_blog_post AS p
        SET category_id = c.id
        FROM bbweb_blog_category AS c,
             bbweb_blog_post_category_mig AS m
        WHERE p.id = m.id
          AND c.code = m.category
        """
    )

    cr.execute(
        """
        UPDATE bbweb_blog_post AS p
        SET category_id = sub.id
        FROM (
            SELECT id FROM bbweb_blog_category
            WHERE code = 'development'
            ORDER BY id
            LIMIT 1
        ) AS sub
        WHERE p.category_id IS NULL
          AND EXISTS (
              SELECT 1 FROM bbweb_blog_post_category_mig m WHERE m.id = p.id
          )
        """
    )

    cr.execute(
        """
        SELECT COUNT(*) FROM bbweb_blog_post p
        WHERE p.category_id IS NULL
          AND EXISTS (
              SELECT 1 FROM bbweb_blog_post_category_mig m WHERE m.id = p.id
          )
        """
    )
    row = cr.fetchone()
    if row and row[0]:
        _logger.warning(
            "binary_buddies_web: %s blog posts still missing category_id after migration",
            row[0],
        )

    cr.execute("DROP TABLE IF EXISTS bbweb_blog_post_category_mig")
    _logger.info("binary_buddies_web: dropped bbweb_blog_post_category_mig")
